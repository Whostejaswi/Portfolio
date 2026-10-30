#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include "DHT.h"

#define WIFI_SSID       "Hwjunction"
#define WIFI_PASSWORD   "forged@forge"

#define API_KEY "AIzaSyD3A97Xlt8juxidFk2yKVVAk_4-PWzaJYE"

#define USER_EMAIL      "tejaswi.24bad125@gmail.com"
#define USER_PASSWORD   "admin123"

#define DATABASE_URL "https://protosem-4fb5a-default-rtdb.asia-southeast1.firebasedatabase.app"

#define DEVICE_ID "ZaScXAm4dhQlD8zBwBvRuyFBojF3"

#define DHTPIN 4
#define DHTTYPE DHT11
#define LDRPIN 34
#define RELAYPIN 26

DHT dht(DHTPIN, DHTTYPE);

UserAuth user_auth(
  API_KEY,
  USER_EMAIL,
  USER_PASSWORD,
  3000
);

FirebaseApp app;
WiFiClientSecure ssl_client;

using AsyncClient = AsyncClientClass;

AsyncClient aClient(ssl_client);
RealtimeDatabase Database;

String BASE_PATH;
String MODE_PATH;
String THRESHOLD_PATH;
String BULB_COMMAND_PATH;
String CURRENT_PATH;
String LOG_PATH;

bool relayState = false;
String mode = "MANUAL";
int ldrThreshold = 500;

unsigned long lastSensorPush = 0;
unsigned long lastSettingsCheck = 0;
unsigned long lastManualCheck = 0;
unsigned long lastAutoCheck = 0;

const unsigned long SENSOR_INTERVAL = 3000;
const unsigned long SETTINGS_INTERVAL = 2000;
const unsigned long MANUAL_CHECK_INTERVAL = 1000;
const unsigned long AUTO_CHECK_INTERVAL = 500;

int readLDR()
{
  const int samples = 15;
  long sum = 0;

  for (int i = 0; i < samples; i++)
  {
    sum += analogRead(LDRPIN);
    delay(8);
  }

  return sum / samples;
}

void applyRelay(bool state)
{
  relayState = state;
  digitalWrite(RELAYPIN, state ? LOW : HIGH); // active-LOW relay: LOW = ON

  Serial.println(
    state ? ">> RELAY: ON" : ">> RELAY: OFF"
  );
}

void updateCurrentBulbState()
{
  if (!app.ready())
    return;

  String path = CURRENT_PATH + "/bulbState";
  bool success = Database.set<String>(
    aClient,
    path,
    relayState ? "ON" : "OFF"
  );

  if (!success)
  {
    Serial.print("Firebase bulb state update failed: ");
    Serial.println(aClient.lastError().message());
  }
}

void readFirebaseSettings()
{
  if (!app.ready())
    return;

  String firebaseMode = Database.get<String>(
    aClient,
    MODE_PATH
  );

  if (aClient.lastError().code() == 0)
  {
    if (firebaseMode.length() > 0)
    {
      firebaseMode.toUpperCase();
      mode = firebaseMode;

      Serial.print("Mode: ");
      Serial.println(mode);
    }
  }
  else
  {
    Serial.print("Mode read failed: ");
    Serial.println(aClient.lastError().message());
  }

  int firebaseThreshold = Database.get<int>(
    aClient,
    THRESHOLD_PATH
  );

  if (aClient.lastError().code() == 0)
  {
    ldrThreshold = firebaseThreshold;

    Serial.print("LDR Threshold: ");
    Serial.println(ldrThreshold);
  }
  else
  {
    Serial.print("Threshold read failed: ");
    Serial.println(aClient.lastError().message());
  }
}

void readManualBulbCommand()
{
  if (!app.ready())
    return;

  String command = Database.get<String>(
    aClient,
    BULB_COMMAND_PATH
  );

  if (aClient.lastError().code() == 0)
  {
    if (command.length() > 0)
    {
      command.toUpperCase();
      bool wantOn = (command == "ON");

      if (wantOn != relayState)
      {
        applyRelay(wantOn);
        updateCurrentBulbState();
      }
    }
  }
  else
  {
    Serial.print("Bulb command read failed: ");
    Serial.println(aClient.lastError().message());
  }
}

void updateCurrentValues(float temperature, float humidity, int ldrValue)
{
  if (!app.ready())
    return;

  String json = "{";
  json += ""temperature":" + String(temperature, 1);
  json += ","humidity":" + String(humidity, 1);
  json += ","ldr":" + String(ldrValue);
  json += ","bulbState":"" + String(relayState ? "ON" : "OFF") + """;
  json += ","mode":"" + mode + """;
  json += "}";

  bool success = Database.set<object_t>(
    aClient,
    CURRENT_PATH,
    object_t(json)
  );

  if (!success)
  {
    Serial.print("Current values update failed: ");
    Serial.println(aClient.lastError().message());
  }
}

void logSensorData(
  float temperature,
  float humidity,
  int ldrValue
)
{
  if (!app.ready())
    return;

  String json = "{";

  json += ""temperature":";
  json += String(temperature, 1);

  json += ","humidity":";
  json += String(humidity, 1);

  json += ","ldr":";
  json += String(ldrValue);

  json += ","bulbState":"";
  json += relayState ? "ON" : "OFF";
  json += """;

  json += ","mode":"";
  json += mode;
  json += """;

  json += ","timestamp":{".sv":"timestamp"}";

  json += "}";

  String pushID = Database.push<object_t>(
    aClient,
    LOG_PATH,
    object_t(json)
  );

  if (aClient.lastError().code() == 0)
  {
    Serial.println("Sensor data pushed successfully.");
    Serial.print("Push ID: ");
    Serial.println(pushID);
  }
  else
  {
    Serial.print("Sensor data push failed: ");
    Serial.println(aClient.lastError().message());
  }
}

void setup()
{
  Serial.begin(115200);
  delay(1000);

  BASE_PATH = "/devices/" + String(DEVICE_ID);

  MODE_PATH          = BASE_PATH + "/settings/mode";
  THRESHOLD_PATH     = BASE_PATH + "/settings/ldrThreshold";
  BULB_COMMAND_PATH  = BASE_PATH + "/settings/bulbCommand";
  CURRENT_PATH       = BASE_PATH + "/current";
  LOG_PATH           = BASE_PATH + "/logs";

  pinMode(LDRPIN, INPUT);
  pinMode(RELAYPIN, OUTPUT);

  applyRelay(false);

  dht.begin();

  Serial.print("Connecting to WiFi");

  WiFi.begin(
    WIFI_SSID,
    WIFI_PASSWORD
  );

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(400);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");

  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());

  ssl_client.setInsecure();

  ssl_client.setConnectionTimeout(1000);
  ssl_client.setHandshakeTimeout(5);

  initializeApp(
    aClient,
    app,
    getAuth(user_auth),
    120000
  );

  app.getApp<RealtimeDatabase>(Database);

  Database.url(DATABASE_URL);

  Serial.println("Firebase initialization started.");
  Serial.println("Waiting for Firebase authentication...");
}

void loop()
{
  app.loop();

  if (!app.ready())
  {
    delay(10);
    return;
  }

  if (
    millis() - lastSettingsCheck >=
    SETTINGS_INTERVAL
  )
  {
    lastSettingsCheck = millis();
    readFirebaseSettings();
  }

  if (mode == "MANUAL")
  {
    if (
      millis() - lastManualCheck >=
      MANUAL_CHECK_INTERVAL
    )
    {
      lastManualCheck = millis();
      readManualBulbCommand();
    }
  }

  if (mode == "AUTO")
  {
    if (
      millis() - lastAutoCheck >=
      AUTO_CHECK_INTERVAL
    )
    {
      lastAutoCheck = millis();

      int ldrValue = readLDR();

      // Hysteresis band instead of a single threshold. Since the LDR sits close
      // enough to the bulb to pick up its own light, a single threshold risks
      // the relay chattering right at the boundary. This creates a dead zone:
      // once ON, it won't turn OFF until comfortably below threshold, and
      // vice versa.
      const int HYSTERESIS = 300;
      bool shouldBeOn = relayState; // default: no change unless clearly past a band edge

      if (ldrValue > (ldrThreshold + HYSTERESIS))
      {
        shouldBeOn = true;
      }
      else if (ldrValue < (ldrThreshold - HYSTERESIS))
      {
        shouldBeOn = false;
      }

      if (shouldBeOn != relayState)
      {
        applyRelay(shouldBeOn);
        updateCurrentBulbState();
      }
    }
  }

  if (
    millis() - lastSensorPush >=
    SENSOR_INTERVAL
  )
  {
    lastSensorPush = millis();

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    int ldrValue = readLDR();

    if (
      isnan(temperature) ||
      isnan(humidity)
    )
    {
      Serial.println("DHT11 read failed.");
      return;
    }

    updateCurrentValues(temperature, humidity, ldrValue);
    updateCurrentBulbState();

    logSensorData(
      temperature,
      humidity,
      ldrValue
    );

    Serial.println();
    Serial.println("------------- SENSOR DATA -------------");

    Serial.print("Temperature : ");
    Serial.print(temperature);
    Serial.println(" °C");

    Serial.print("Humidity    : ");
    Serial.print(humidity);
    Serial.println(" %");

    Serial.print("LDR         : ");
    Serial.println(ldrValue);

    Serial.print("Threshold   : ");
    Serial.println(ldrThreshold);

    Serial.print("Mode        : ");
    Serial.println(mode);

    Serial.print("Bulb        : ");
    Serial.println(
      relayState ? "ON" : "OFF"
    );

    Serial.println("---------------------------------------");
    Serial.println();
  }

  delay(10);
}
