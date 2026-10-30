#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>

#define DHTPIN    4
#define DHTTYPE   DHT11
#define LDR_PIN   34
#define RELAY_PIN 26

DHT dht(DHTPIN, DHTTYPE);

#define FIREBASE_HOST "your-project.firebaseio.com"
#define FIREBASE_AUTH "YOUR_FIREBASE_SECRET_OR_TOKEN"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(RELAY_PIN, OUTPUT);

  WiFi.begin("YOUR_WIFI_SSID", "YOUR_WIFI_PASSWORD");
  while (WiFi.status() != WL_CONNECTED) delay(500);

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
}

void loop() {
  float temp = dht.readTemperature();
  float hum  = dht.readHumidity();
  int   ldr  = analogRead(LDR_PIN);

  Firebase.RTDB.setFloat(&fbdo, "/current/temperature", temp);
  Firebase.RTDB.setFloat(&fbdo, "/current/humidity", hum);
  Firebase.RTDB.setInt(&fbdo, "/current/ldr", ldr);

  if (Firebase.RTDB.getString(&fbdo, "/settings/bulbCommand")) {
    String command = fbdo.stringData();
    digitalWrite(RELAY_PIN, command == "ON" ? HIGH : LOW);
  }

  delay(3000);
}
