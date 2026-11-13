// ============================================================
// INTERNET OF THINGS LOG
// ------------------------------------------------------------
// HOW TO ADD A NEW ENTRY:
// 1. Copy one entry block below (or the template block), paste it
//    right before the closing "];" (newest entry goes LAST, at the
//    bottom of the list)
// 2. Fill in date / title / text
// 3. Optional structured sections — all omittable, each renders as its
//    own labeled section in the entry popup, in this order:
//      concepts      — string, explain the core idea in your own words
//      hardware      — array of strings, components/software used
//      diagram       — string, a simple arrow-flow line (A --> B --> C)
//      wiring        — array of strings, pin connections
//      configuration — array of strings, cloud/app/dashboard setup steps
//      code          — array of { label, code } blocks, rendered monospace
//      challenges    — array of strings, bugs hit + how you fixed them
//      repo          — string, link to the exact folder/branch for this task
//      reflection    — string, what you learned / what's next
// 4. Optional: add an "images" array (paths to photos) and/or a "videos"
//    array (paths to video files, e.g. .mp4) — if either is present,
//    they'll show together as a stacked pile at the bottom of the entry
//    popup (photos first, then videos; videos get a small play icon),
//    and clicking the stack opens a left/right scrollable lightbox
//    through all of them. Videos play inline with controls.
//
// TEMPLATE TO COPY:
// {
//   date: "2026-09-01",
//   title: "Entry title",
//   text: `What you worked on, what you learned, what's next.`,
//   concepts: `The core idea, explained like you'd tell a friend.`,
//   hardware: ["Component one", "Component two"],
//   diagram: "Input --> ESP32 --> Output",
//   wiring: ["GPIO4 --> sensor data pin"],
//   configuration: ["Step 1", "Step 2"],
//   code: [
//     { label: "main.ino — setup()", code: `void setup() {\n  // ...\n}` },
//   ],
//   challenges: ["Bug: X happened. Fix: did Y."],
//   repo: "https://github.com/yourname/yourrepo/tree/main/task-x",
//   reflection: `What stuck with you from this one.`,
//   images: [
//     "assets/iot/your-photo-1.jpg",
//     "assets/iot/your-photo-2.jpg",
//   ],
//   videos: [
//     "assets/iot/your-demo-clip.mp4",
//   ],
// },
// ============================================================

const iotLog = [
  {
    date: "2026-09-01",
    title: "Task 1 — Controlling an LED over HTTP",
    repo: "https://github.com/Whostejaswi/Portfolio/tree/main/code/task1-http-led",
    text: `For this one I turned my ESP32 into its own tiny web server, just so I could switch its built-in LED on and off from a browser — no app, no cloud, nothing extra involved.

I connected it to my Wi-Fi using WiFi.h, then used WebServer.h to set up two routes — /on and /off — that just flip the LED pin whenever the browser hits them. The LED is the built-in one on GPIO2, so I didn't even need extra components for this one, just the board itself.

It's basically a request-response loop: browser sends /on or /off, ESP32 gets the request, flips the pin, replies. Simple, but it only works if I'm on the same Wi-Fi network as the board — and that limitation is exactly what pushed me into Task 2.`,
    concepts: `An ESP32 web server works like a miniature version of any website's backend — it listens on a port, matches incoming requests to routes, and runs a function for whichever route matches. WiFi.h gets the board onto the network in the first place; WebServer.h is what actually handles the routing and replies.`,
    hardware: ["ESP32 Dev Board", "Built-in LED (GPIO2) — no extra components needed", "USB cable", "Arduino IDE"],
    diagram: "Browser --> HTTP request (/on or /off) --> ESP32 --> GPIO2 --> LED",
    wiring: ["Built-in LED is already wired to GPIO2 on the board — nothing external to connect"],
    code: [
      {
        label: "esp32_led_server.ino",
        code: `/*
 * TASK 01: ESP32 Web Server & Built-in LED Control
 * Board: ESP32 Dev Module
 * GPIO: Pin 2 (Onboard LED)
 * Sanitized for public release - Replace WiFi credentials before upload.
 */

#include <WiFi.h>
#include <WebServer.h>

// Replace with your local Wi-Fi credentials
const char* ssid = "YOUR_WIFI_SSID_HERE";
const char* password = "YOUR_WIFI_PASSWORD_HERE";

WebServer server(80);
const int LED_PIN = 2;

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<title>ESP32 LED Control</title>";
  html += "<style>body{font-family:Arial;text-align:center;margin-top:50px;}";
  html += ".btn{display:inline-block;padding:15px 30px;font-size:18px;color:white;border:none;border-radius:8px;text-decoration:none;margin:10px;}";
  html += ".on{background-color:#4CAF50;} .off{background-color:#f44336;}</style></head><body>";
  html += "<h2>ESP32 Web Server LED Control</h2>";
  html += "<a href='/on' class='btn on'>TURN LED ON</a>";
  html += "<a href='/off' class='btn off'>TURN LED OFF</a>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleOn() {
  digitalWrite(LED_PIN, HIGH);
  server.sendHeader("Location", "/");
  server.send(303);
}

void handleOff() {
  digitalWrite(LED_PIN, LOW);
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Wi-Fi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/on", handleOn);
  server.on("/off", handleOff);

  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}
`,
      },
    ],
    // TODO: add a real challenge if one comes to mind — even something small
    // (e.g. "board kept dropping Wi-Fi on first boot, fixed by moving router
    // closer" or "forgot the LED is active-HIGH on this board and wired my
    // logic backwards at first") makes this page read as genuine work rather
    // than a clean success story, which is literally what the guide asks for.
    challenges: [
      `For the first task , i did not face a lot of challenges because the requirements were quite straight forward. Only issue i faced was the Wi-Fi connection issue. The ESP32 kept dropping Wi-Fi on first boot, fixed by using personal hotspot instead of router.`
    ],
  
    reflection: `Small task, but it's the base every later one builds on — once you can flip a pin from a browser, cloud control is really just swapping out the transport layer underneath.`,
    images: [
      "assets/iot/led-switch.png"
    ],
    videos: [
      "assets/iot/led-switch.mp4"
    ]
  },
  {
    date: "2026-09-04",
    title: "Task 2 — MQTT dashboard controlling a real bulb",
    repo: "https://github.com/Whostejaswi/Portfolio/tree/main/code/task2-mqtt-relay",
    text: `Here I moved off the local network completely. I set up an Adafruit IO dashboard with a switch, and that switch now controls an actual 230V bulb through a relay — from anywhere with internet, not just my home Wi-Fi.

Components were the ESP32, a 5V relay module (SRD-05VDC-SL-C), and the bulb itself. GPIO26 goes to the relay's IN pin, and on this relay, GPIO26 HIGH means the coil turns on. Only the bulb's Live wire runs through the relay's COM → NO contacts — Neutral goes straight to the bulb and is never switched, which matters a lot when you're dealing with mains voltage.

MQTT works pretty differently from HTTP. Instead of me asking the ESP32 for something, it just subscribes to a "feed" on Adafruit IO, and the moment the dashboard publishes ON or OFF, it reacts instantly. I also tested the relay logic with a safe low-voltage signal first before I let it anywhere near the actual mains wiring — wasn't about to skip that step.`,
    concepts: `MQTT flips the usual request-response model on its head: instead of asking for something, the ESP32 subscribes to a "feed" (a topic) on a broker — here, Adafruit IO — and reacts the instant a new value is published to it. No polling, no asking, it just listens.`,
    hardware: ["ESP32 Dev Board", "5V relay module (SRD-05VDC-SL-C)", "230V bulb + holder", "Adafruit IO account"],
    diagram: "Adafruit IO switch --> MQTT --> ESP32 (GPIO26) --> Relay --> 230V Bulb",
    wiring: [
      "GPIO26 --> Relay IN pin (GPIO26 HIGH = coil ON on this relay)",
      "Relay COM --> bulb's Live wire",
      "Relay NO --> mains Live",
      "Bulb Neutral --> mains Neutral directly — never switched",
    ],
    configuration: [
      "Created a free Adafruit IO account and generated an AIO key",
      "Added a new feed called bulb-switch to publish/subscribe ON and OFF values",
      "Built a simple dashboard block (toggle switch) wired to that feed so I had a UI without writing any front-end code",
    ],
    code: [
      {
        label: "esp32_mqtt_relay.ino",
        code: `#include <WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

#define AIO_SERVER      "io.adafruit.com"
#define AIO_SERVERPORT  1883
#define AIO_USERNAME    "YOUR_AIO_USERNAME"
#define AIO_KEY         "YOUR_AIO_KEY"

const int RELAY_PIN = 26;

WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);
Adafruit_MQTT_Subscribe bulbFeed = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/bulb-switch");

void connectMQTT() {
  int8_t ret;
  while ((ret = mqtt.connect()) != 0) {
    Serial.println(mqtt.connectErrorString(ret));
    mqtt.disconnect();
    delay(5000);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  mqtt.subscribe(&bulbFeed);
}

void loop() {
  connectMQTT();

  Adafruit_MQTT_Subscribe *subscription;
  while ((subscription = mqtt.readSubscription(5000))) {
    if (subscription == &bulbFeed) {
      String value = (char *)bulbFeed.lastread;
      digitalWrite(RELAY_PIN, value == "ON" ? HIGH : LOW);
    }
  }
}`,
      },
    ],
    // TODO: same as Task 1 — add a real bug here if one happened (relay
    // wiring reversed on first try, MQTT disconnect loop, etc.)
    challenges: [`A major challenge i faced was the MQTT disconnect loop. The ESP32 kept disconnecting from the Adafruit IO broker, which caused the relay to stop responding. I fixed this by implementing a reconnect function that checks the connection status and attempts to reconnect if disconnected. Another issue we had was the logic for the adafruit dashboard and our relay connections seemed to be reversed. We fixed this by changing the logic in the code to match the actual wiring of the relay, ensuring that when the dashboard sends "ON", the relay activates and turns on the bulb, and vice versa.`],
    
    reflection: `This is the one that actually made "IoT" click for me — the ESP32 reacting to something happening on the other side of the world, not just on my own Wi-Fi.`,
    images: [
      "assets/iot/relay-switch.png",
      "assets/iot/relay-wiring.png"
    ],
    videos: [
      "assets/iot/relay switch.mp4"
    ]
  },
  {
    date: "2026-09-07",
    title: "Task 3 — Turning the bulb on with my voice",
    repo: "https://github.com/Whostejaswi/Portfolio/tree/main/code/task3-voice-ifttt",
    text: `Same exact hardware as Task 2, no rewiring at all — I just added a voice layer on top of it. Now saying "Okay Google, activate bulb ON" controls the same relay.

I set up two IFTTT applets (one for ON, one for OFF) with Google Assistant as the trigger and an Adafruit IO action, "Send data to relay feed", so the voice command lands on the same feed the ESP32 was already listening to. The part I found genuinely interesting: I didn't have to touch the firmware at all. The ESP32 has no idea whether a value on its feed came from someone tapping the dashboard or from a voice command — it just reacts either way. Once the plumbing from Task 2 was right, this was almost entirely a no-code layer on top.`,
    concepts: `IFTTT (If This Then That) is a service that connects apps with simple rules, and every rule is a Trigger → Action pair. Here the trigger is a voice phrase heard by Google Assistant, and the action is IFTTT's Adafruit IO service sending data to the feed the ESP32 is already subscribed to. IFTTT is useful here because it saves me from writing a Google Assistant integration myself, and Adafruit IO is the cloud middle layer (MQTT broker + feed) that carries the command down to the board.`,
    sections: [
      {
        heading: "the IFTTT applets",
        items: [
          "Applet 1 — Trigger: Google Assistant, I say \"Okay Google, activate bulb ON\"",
          "Applet 2 — Trigger: Google Assistant, I say \"Okay Google, activate bulb OF\"",
          "Action for both: Adafruit IO → Send data to relay feed (the ON applet sends the ON value, the OFF applet sends the OFF value)",
          "The first screenshot below shows both applets set up and showing as Connected",
        ],
      },
      {
        heading: "trigger and action",
        body: `The trigger is the spoken phrase, recognised by Google Assistant. The action is IFTTT sending a new value to my Adafruit IO feed. Nothing else is involved, and the ESP32 is never contacted directly.`,
      },
      {
        heading: "how the voice command reaches the ESP32",
        items: [
          "1. I say the phrase and Google Assistant matches it to the IFTTT applet",
          "2. IFTTT fires the action and sends the value to my relay feed on Adafruit IO, over the internet",
          "3. Adafruit IO stores it and, because the ESP32 is subscribed to that feed over MQTT, publishes it to the board straight away",
          "4. The ESP32's loop receives the new value and switches the relay on GPIO26, so the bulb turns on or off",
          "5. The second screenshot shows the Adafruit IO toggle block for the same feed, which is the same path my dashboard switch uses",
        ],
      },
    ],
    hardware: ["ESP32 Dev Board (same as Task 2)", "5V relay module (SRD-05VDC-SL-C) on GPIO26", "230V bulb + holder", "Arduino IDE with the Adafruit MQTT library (same sketch as Task 2, unchanged)", "Adafruit IO (feed + dashboard)", "IFTTT account with the Google Assistant and Adafruit IO services", "Google Assistant on the phone"],
    diagram: "Voice command --> Google Assistant --> IFTTT applet (trigger) --> Adafruit IO feed (action) --> MQTT --> ESP32 (same as Task 2) --> Relay --> Bulb",
    wiring: ["Identical wiring to Task 2 — this task is purely a cloud/automation layer on top"],
    configuration: [
      "Created an IFTTT account and connected the Google Assistant service using the same Google account as my Assistant",
      "Connected the Adafruit IO service to IFTTT by linking my Adafruit IO account",
      "Built two applets: 'If you say \"Okay Google, activate bulb ON\", then Send data to relay feed' and 'If you say \"Okay Google, activate bulb OF\", then Send data to relay feed'",
      "Pointed both actions at the same relay feed from Task 2, one sending the ON value and the other the OFF value",
      "Left both applets Connected (turned on) so the phrases work any time",
    ],
    code: [
      {
        label: "Equivalent Adafruit IO API call (what the applet's action amounts to — illustrative)",
        code: `POST https://io.adafruit.com/api/v2/YOUR_AIO_USERNAME/feeds/bulb-switch/data
Content-Type: application/json
X-AIO-Key: YOUR_AIO_KEY

{
  "value": "ON"
}`,
      },
      {
        label: "esp32_mqtt_relay.ino — same firmware and hardware as Task 2",
        code: `#include <WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

#define AIO_SERVER      "io.adafruit.com"
#define AIO_SERVERPORT  1883
#define AIO_USERNAME    "YOUR_AIO_USERNAME"
#define AIO_KEY         "YOUR_AIO_KEY"

const int RELAY_PIN = 26;

WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);
Adafruit_MQTT_Subscribe bulbFeed = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/bulb-switch");

void connectMQTT() {
  int8_t ret;
  while ((ret = mqtt.connect()) != 0) {
    Serial.println(mqtt.connectErrorString(ret));
    mqtt.disconnect();
    delay(5000);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  mqtt.subscribe(&bulbFeed);
}

void loop() {
  connectMQTT();

  Adafruit_MQTT_Subscribe *subscription;
  while ((subscription = mqtt.readSubscription(5000))) {
    if (subscription == &bulbFeed) {
      String value = (char *)bulbFeed.lastread;
      digitalWrite(RELAY_PIN, value == "ON" ? HIGH : LOW);
    }
  }
}`,
      },
    ],
    // TODO: real bug if any — e.g. phrase-matching quirks, applet not firing
    // on the first phrasing you tried, rate limiting
    challenges: [
      "Problem: Google Assistant had a hard time recognising the exact phrase I set up in IFTTT. Fix: I tried several variations of the command until one triggered the applet consistently.",
      "Problem: there was a delay between the voice command and the bulb reacting. Cause: network latency plus IFTTT's processing time, since the command passes through Google, IFTTT and Adafruit IO before reaching the board. Mitigation: I changed the phrase from \"Turn off the bulb\" to \"Turn of the bulb\", which the assistant recognised easily and which worked consistently.",
    ],
    
    reflection: `I didn't touch the firmware at all for this one, and that was the actual lesson — good architecture means the hardware doesn't care where a command came from.`,
    images: [
      "assets/iot/google-assistant.png",
      "assets/iot/google-assistant dashboard.png"
    ],
    videos: [
      "assets/iot/google-assistant.mp4"
    ]
  },
  {
    date: "2026-09-11",
    title: "Task 4 — Building my own Firebase dashboard",
    repo: "https://github.com/Whostejaswi/Portfolio/tree/main/code/task4-firebase-dashboard",
    text: `This is where I moved off Adafruit IO entirely and built my own dashboard from scratch, backed by Firebase — complete with a login page and live sensor readings instead of just a switch.

Components this time: ESP32, a DHT11 for temperature and humidity, an LDR for light, and the same relay + bulb setup. DHT11 data goes to GPIO4, the LDR's analog output goes to GPIO34, and the relay stays on GPIO26.

A couple of things I had to actually sit down and understand for this one instead of just plugging in and going: Firebase is a BaaS — Backend-as-a-Service — so it hands you a ready-made database and login system instead of you building your own backend server. The Realtime Database keeps everything in sync automatically, so I'm not sitting there refreshing the page hoping for new data. I also finally got the difference between authentication and authorization straight in my head: authentication is Firebase checking that my email and password are correct, authorization is making sure I can only read and write my own device's data, not anyone else's.`,
    concepts: `Firebase is a BaaS (Backend-as-a-Service) — it hands you a ready-made database and login system instead of making you build a backend server yourself. The Realtime Database keeps everything in sync automatically, so the dashboard updates itself instead of needing a refresh. And authentication vs. authorization, finally straight in my head: authentication is Firebase checking my email and password are correct; authorization is making sure I can only read and write my own device's data, not anyone else's.`,
    sections: [
      {
        heading: "cloud computing and the four service models",
        body: `Cloud computing just means using computing power, storage and software that live in someone else's data centre over the internet, instead of running my own server. It's usually split into four levels. IaaS (Infrastructure as a Service) gives you raw machines and storage to set up yourself, like an AWS EC2 virtual machine. PaaS (Platform as a Service) gives you a ready environment to deploy code on without managing the servers, like Google App Engine. SaaS (Software as a Service) is a finished app you simply use, like Gmail. BaaS (Backend as a Service) hands you ready-made backend pieces, a database, logins and hosting, that your app calls directly. Firebase is the BaaS one, and that's the level I worked at for this task.`,
      },
      {
        heading: "what a cloud platform is",
        body: `A cloud platform is a provider's collection of online services (compute, storage, databases, logins, hosting) that I rent and use through the internet instead of buying hardware. Firebase runs on Google Cloud, so my 'server' here is really just a project in the Firebase console.`,
      },
      {
        heading: "what a database is",
        body: `A database is an organised place to store data so it can be saved, read and updated later instead of vanishing when the program stops. Here the ESP32 needs somewhere to leave sensor readings and the dashboard needs somewhere to read them from, so the database is the middle man they both talk to.`,
      },
      {
        heading: "Firebase Realtime Database",
        body: `The Realtime Database is a NoSQL cloud database that stores everything as one big JSON tree. Its useful trick is that clients can subscribe to a path, and Firebase pushes every change to them straight away. My dashboard uses onValue() listeners on the current, settings and logs paths, so numbers update on screen the moment the ESP32 writes them, with no refresh. The ESP32 reads and writes the same tree over the Firebase client library.`,
      },
      {
        heading: "what a cloud-based dashboard is",
        body: `A cloud-based dashboard is a web page hosted online that reads its data from a cloud database, so I can open it from any browser or device and still see the live state of my room. Mine is a single dashboard page (HTML, CSS and JavaScript) deployed on Firebase Hosting. It has live temperature, humidity and light values, a bulb button and a mode switch, and it sits behind a login.`,
      },
      {
        heading: "authentication and why a login system matters",
        body: `Authentication is proving who you are, here with an email and password checked by Firebase Authentication. Without a login, anyone who found my dashboard link could switch my bulb on and off or read my data, since the page itself is public. So the dashboard checks the signed-in user as soon as it loads (onAuthStateChanged) and sends anyone who isn't signed in back to the login page.`,
      },
      {
        heading: "authentication vs authorization",
        body: `Authentication answers 'who are you?' and authorization answers 'what are you allowed to do?'. Logging in with the right password is authentication. Authorization is the database rule that says a signed-in user can only read and write their own devices/<uid> branch and nothing else. Being logged in doesn't automatically give access to everything, and that second check is what actually protects the data.`,
      },
      {
        heading: "Firebase Authentication configuration",
        items: [
          "Opened Authentication in the Firebase console and enabled the Email/Password sign-in method (Google sign-in is also enabled, you can see both providers in the auth screenshot)",
          "Created my user account under the Users tab, and this same account is what the ESP32 signs in with, so the board is an authenticated client too",
          "Each user gets a unique UID, and I use it as the device path, so my data lives at devices/<uid>/...",
          "The dashboard redirects to the login page whenever there's no signed-in user",
        ],
      },
      {
        heading: "how the data flows",
        items: [
          "1. The ESP32 reads the DHT11 (temperature, humidity) and the LDR (light level)",
          "2. It signs in to Firebase with its email and password, then writes the live values to devices/<uid>/current",
          "3. The dashboard, signed in as the same user, listens to that path and updates the cards instantly",
          "4. When I press the bulb button or change the mode, the dashboard writes to devices/<uid>/settings",
          "5. The ESP32 keeps checking the settings path, and when the command changes it drives the relay on GPIO26 to switch the bulb",
        ],
      },
    ],
    hardware: ["ESP32 Dev Board", "DHT11 (temperature + humidity)", "LDR (light sensor)", "5V relay + 230V bulb", "Firebase project (Realtime Database + Authentication)"],
    diagram: "DHT11 + LDR --> ESP32 --> Firebase Realtime Database --> Dashboard (logged in)\nDashboard button --> Firebase --> ESP32 --> Relay --> Bulb",
    wiring: [
      "DHT11 data --> GPIO4",
      "LDR analog output --> GPIO34",
      "Relay IN --> GPIO26 (same as Task 2)",
    ],
    configuration: [
      "Created a new Firebase project and enabled the Realtime Database and Authentication (email/password) products",
      "Added myself as a user under Authentication so the dashboard has a real login instead of an open page",
      "Set Realtime Database rules so only an authenticated user can read/write their own device path, rather than leaving the database open to anyone with the URL",
      "Pulled the Firebase config (API key, database URL, project ID) into both the dashboard front-end and the ESP32 sketch",
    ],
    code: [
      {
        label: "dashboard.html — complete dashboard source (Firebase config removed)",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard — Nicko's House</title>
<style>
  :root{
    --bg:#fdf6ec;--bg2:#f7ead6;--ink:#2e2118;--muted:#8a7863;
    --accent:#d97b3f;--accent2:#c65a2c;--card:#ffffff;--border:#ecdcc4;
    --ok:#4a8c5f;--warn:#c0392b;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{
    font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
    background:linear-gradient(180deg,var(--bg) 0%,var(--bg2) 100%);
    color:var(--ink);min-height:100vh;
  }
  header{
    display:flex;justify-content:space-between;align-items:center;
    padding:20px 5%;background:#fffdf9;border-bottom:1px solid var(--border);
  }
  .logo{font-weight:800;font-size:1.15rem;}
  .logo span{color:var(--accent2);}
  .userbar{display:flex;align-items:center;gap:14px;}
  #userEmail{font-size:0.85rem;color:var(--muted);}
  .signout{
    background:transparent;border:1px solid var(--border);padding:8px 16px;
    border-radius:20px;cursor:pointer;font-size:0.85rem;font-weight:600;color:var(--ink);
  }
  main{max-width:1100px;margin:0 auto;padding:32px 5% 60px;}

  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:18px;margin-bottom:30px;}
  .tile{
    background:var(--card);border:1px solid var(--border);border-radius:16px;
    padding:22px;text-align:center;
  }
  .tile .label{font-size:0.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;}
  .tile .value{font-size:2rem;font-weight:800;margin-top:8px;color:var(--accent2);}
  .tile .unit{font-size:0.9rem;color:var(--muted);}

  .panel{
    background:var(--card);border:1px solid var(--border);border-radius:16px;
    padding:24px;margin-bottom:24px;
  }
  .panel h3{margin-bottom:16px;font-size:1.05rem;}

  .controls{display:flex;flex-wrap:wrap;gap:24px;align-items:center;}
  .mode-toggle{display:flex;background:var(--bg2);border-radius:30px;padding:4px;}
  .mode-toggle button{
    border:none;background:transparent;padding:8px 20px;border-radius:26px;
    font-weight:700;cursor:pointer;font-size:0.9rem;color:var(--muted);
  }
  .mode-toggle button.active{background:var(--accent2);color:#fff;}
  .bulb-btn{
    padding:10px 26px;border-radius:24px;border:none;font-weight:700;cursor:pointer;
    background:#ddd;color:#666;
  }
  .bulb-btn.on{background:var(--ok);color:#fff;}
  .bulb-btn:disabled{opacity:0.5;cursor:not-allowed;}
  .threshold-group label{font-size:0.85rem;color:var(--muted);margin-right:8px;}
  .threshold-group input{
    width:90px;padding:8px 10px;border:1px solid var(--border);border-radius:8px;
  }

  table{width:100%;border-collapse:collapse;font-size:0.88rem;}
  th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);}
  th{color:var(--muted);font-weight:600;font-size:0.78rem;text-transform:uppercase;}
  .empty-state{text-align:center;color:var(--muted);padding:30px;font-size:0.9rem;}

  canvas{width:100% !important;max-height:320px;}

  .export-btn{
    background:var(--accent2);color:#fff;border:none;padding:10px 22px;
    border-radius:24px;font-weight:700;cursor:pointer;font-size:0.9rem;
  }
  .panel-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
</style>
</head>
<body>
  <header>
    <div class="logo">🏡 nicko<span>'s house</span></div>
    <div class="userbar">
      <span id="userEmail">—</span>
      <button class="signout" id="signOutBtn">Sign out</button>
    </div>
  </header>

  <main>
    <div class="tiles">
      <div class="tile"><div class="label">Temperature</div><div class="value" id="tTemp">—</div><div class="unit">°C</div></div>
      <div class="tile"><div class="label">Humidity</div><div class="value" id="tHum">—</div><div class="unit">%</div></div>
      <div class="tile"><div class="label">Light (LDR)</div><div class="value" id="tLdr">—</div><div class="unit">raw</div></div>
      <div class="tile"><div class="label">Bulb</div><div class="value" id="tBulb">—</div><div class="unit">state</div></div>
      <div class="tile"><div class="label">Mode</div><div class="value" id="tMode">—</div><div class="unit">current</div></div>
    </div>

    <div class="panel">
      <h3>Controls</h3>
      <div class="controls">
        <div class="mode-toggle">
          <button id="manualBtn">Manual</button>
          <button id="autoBtn">Auto</button>
        </div>
        <button class="bulb-btn" id="bulbBtn">Bulb OFF</button>
        <div class="threshold-group">
          <label>LDR threshold</label>
          <input type="number" id="thresholdInput" placeholder="e.g. 500">
          <button class="signout" id="saveThresholdBtn">Save</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Sensor trends</h3>
      </div>
      <canvas id="trendChart"></canvas>
      <div class="empty-state" id="chartEmpty">No readings logged yet — data will appear here once your ESP32 starts sending.</div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>History</h3>
        <button class="export-btn" id="exportBtn">Download CSV</button>
      </div>
      <table>
        <thead>
          <tr><th>Timestamp</th><th>Temp (°C)</th><th>Humidity (%)</th><th>LDR</th><th>Bulb</th><th>Mode</th></tr>
        </thead>
        <tbody id="historyBody"></tbody>
      </table>
      <div class="empty-state" id="tableEmpty">No history yet.</div>
    </div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
    import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
    import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

    // Paste your own Firebase web-app config here (same one login.html uses)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.YOUR_REGION.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "1:YOUR_SENDER_ID:web:45175f3c288c4e878d51c6",
  measurementId: "YOUR_MEASUREMENT_ID"
};

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);

    let uid = null;
    let currentMode = null;
    let chart = null;

    onAuthStateChanged(auth, (user)=>{
      if(!user){ window.location.href = "login.html"; return; }
      uid = user.uid;
      document.getElementById("userEmail").textContent = user.email || "Google user";
      attachListeners();
    });

    document.getElementById("signOutBtn").addEventListener("click", ()=>{
      signOut(auth).then(()=> window.location.href = "index.html");
    });

    function attachListeners(){
      // Live current values
      onValue(ref(db, \`devices/\${uid}/current\`), (snap)=>{
        const d = snap.val();
        if(!d) return;
        document.getElementById("tTemp").textContent = d.temperature ?? "—";
        document.getElementById("tHum").textContent = d.humidity ?? "—";
        document.getElementById("tLdr").textContent = d.ldr ?? "—";
        document.getElementById("tBulb").textContent = d.bulbState ?? "—";
        document.getElementById("tMode").textContent = d.mode ?? "—";

        const bulbBtn = document.getElementById("bulbBtn");
        bulbBtn.textContent = \`Bulb \${d.bulbState || "OFF"}\`;
        bulbBtn.classList.toggle("on", d.bulbState === "ON");
      });

      // Settings (mode, threshold)
      onValue(ref(db, \`devices/\${uid}/settings\`), (snap)=>{
        const s = snap.val();
        if(!s) return;
        currentMode = s.mode || "AUTO";
        document.getElementById("manualBtn").classList.toggle("active", currentMode === "MANUAL");
        document.getElementById("autoBtn").classList.toggle("active", currentMode === "AUTO");
        document.getElementById("bulbBtn").disabled = currentMode !== "MANUAL";
        if(s.ldrThreshold !== undefined){
          document.getElementById("thresholdInput").value = s.ldrThreshold;
        }
      });

      // Historical logs -> table + chart, no placeholder data
      onValue(ref(db, \`devices/\${uid}/logs\`), (snap)=>{
        const logs = snap.val();
        const tbody = document.getElementById("historyBody");
        const tableEmpty = document.getElementById("tableEmpty");
        const chartEmpty = document.getElementById("chartEmpty");
        tbody.innerHTML = "";

        if(!logs){
          tableEmpty.style.display = "block";
          chartEmpty.style.display = "block";
          if(chart){ chart.destroy(); chart = null; }
          return;
        }

        const rows = Object.values(logs).sort((a,b)=> a.timestamp - b.timestamp);
        tableEmpty.style.display = "none";
        chartEmpty.style.display = "none";

        rows.slice().reverse().forEach(r=>{
          const tr = document.createElement("tr");
          tr.innerHTML = \`
            <td>\${new Date(r.timestamp).toLocaleString()}</td>
            <td>\${r.temperature}</td>
            <td>\${r.humidity}</td>
            <td>\${r.ldr}</td>
            <td>\${r.bulbState}</td>
            <td>\${r.mode}</td>\`;
          tbody.appendChild(tr);
        });

        drawChart(rows);
      });
    }

    function drawChart(rows){
      const labels = rows.map(r => new Date(r.timestamp).toLocaleTimeString());
      const temps = rows.map(r => r.temperature);
      const hums = rows.map(r => r.humidity);
      const ldrs = rows.map(r => r.ldr);

      const ctx = document.getElementById("trendChart").getContext("2d");
      if(chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            { label: "Temperature (°C)", data: temps, borderColor: "#d97b3f", tension: 0.3 },
            { label: "Humidity (%)", data: hums, borderColor: "#4a8c5f", tension: 0.3 },
            { label: "LDR", data: ldrs, borderColor: "#8a7863", tension: 0.3 }
          ]
        },
        options: { responsive: true, plugins: { legend: { position: "bottom" } } }
      });
    }

    // Manual / Auto mode toggle
    document.getElementById("manualBtn").addEventListener("click", ()=>{
      update(ref(db, \`devices/\${uid}/settings\`), { mode: "MANUAL" });
    });
    document.getElementById("autoBtn").addEventListener("click", ()=>{
      update(ref(db, \`devices/\${uid}/settings\`), { mode: "AUTO" });
    });

    // Manual bulb control
    document.getElementById("bulbBtn").addEventListener("click", ()=>{
      const btn = document.getElementById("bulbBtn");
      const next = btn.classList.contains("on") ? "OFF" : "ON";
      update(ref(db, \`devices/\${uid}/settings\`), { bulbCommand: next });
    });

    // Threshold save
    document.getElementById("saveThresholdBtn").addEventListener("click", ()=>{
      const val = Number(document.getElementById("thresholdInput").value);
      if(!isNaN(val)){
        update(ref(db, \`devices/\${uid}/settings\`), { ldrThreshold: val });
      }
    });

    // CSV export
    document.getElementById("exportBtn").addEventListener("click", ()=>{
      onValue(ref(db, \`devices/\${uid}/logs\`), (snap)=>{
        const logs = snap.val();
        if(!logs){ alert("No data to export yet."); return; }
        let csv = "Timestamp,Temperature,Humidity,LDR,BulbState,Mode\\n";
        Object.values(logs).forEach(r=>{
          csv += \`\${new Date(r.timestamp).toISOString()},\${r.temperature},\${r.humidity},\${r.ldr},\${r.bulbState},\${r.mode}\\n\`;
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "nickos_house_logs.csv";
        a.click();
      }, { onlyOnce: true });
    });
  </script>
</body>
</html>
`,
      },
      {
        label: "Realtime Database structure",
        code: `devices/
  <uid>/                       <- the logged-in user's UID
    current/                   <- live snapshot, overwritten every 3 s
      temperature, humidity, ldr, bulbState ("ON"/"OFF"), mode
    settings/                  <- written by the dashboard
      mode ("MANUAL"/"AUTO"), ldrThreshold, bulbCommand ("ON"/"OFF")
    logs/                      <- history, one entry per reading
      -Nabc123.../             <- unique key from push()
        temperature, humidity, ldr, bulbState, mode,
        timestamp              <- Firebase server time (ms)`,
      },
      {
        label: "esp32_firebase_dashboard.ino",
        code: `#include <WiFi.h>
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
}`,
      },
    ],
    // TODO: real bug if any — auth errors, rule misconfiguration, etc.
    challenges: [`Though this task seemed simple, i had a lot of trouble setting my dashboard. While setting up the Firebase dashboard, I faced several integration challenges. The main issues were configuring Firebase Authentication and Realtime Database permissions, resolving “unauthorized” errors from the ESP32, and aligning the Firebase database paths between the ESP32 and dashboard. I also encountered mismatches in device IDs, data structures, and mode values (AUTO vs. AUTOMATIC). The dashboard initially failed to display live and historical sensor readings because it was reading different database paths.`],
    reflection: `Understanding BaaS and auth vs. authorization mattered more here than the wiring did — this was the first task where the cloud side was genuinely harder than the electronics.`,
    images: [
      "assets/iot/dashboard.png",
      "assets/iot/dashboard-1.png",
      "assets/iot/database.png",
      "assets/iot/auth.png",
    ],
    videos:
    [
      "assets/iot/webpage worfklow.mp4"
    ]
  },
  {
    date: "2026-09-15",
    title: "Task 5 — Logging, automation, and a whole lot of debugging",
    repo: "https://github.com/Whostejaswi/Portfolio/tree/main/code/task5-logging-automation",
    text: `This last one pulled everything together — manual and automatic bulb control, a full history of readings, and CSV export. Honestly, most of the actual work here wasn't building new features, it was debugging, because my dashboard and firmware had been built a bit separately and didn't actually agree with each other.

The final structure ended up being one device path with three parts: a "current" branch for live values (temperature, humidity, LDR reading, bulb state, mode), a "settings" branch for mode/threshold/commands, and a "logs" branch for timestamped history, one entry per reading.

Automatic mode compares the LDR reading against a threshold I set on the dashboard, but with a small buffer zone around it rather than one exact cutoff — otherwise the relay just kept flickering right at the edge.

After finally getting this all working through multiple rounds of debugging, I can see why people just buy a ready-made smart bulb instead of building their own — but I also learned a lot more about how the plumbing works behind the scenes, and that was the whole point of this project.`,
    concepts: `The three Firebase branches split cleanly by purpose: /current for the live snapshot, /settings for anything the dashboard controls, /logs for the historical trail. Automatic mode just compares the live LDR reading to a threshold, but with a buffer zone around it (hysteresis) so the relay doesn't flicker right at the edge.`,
    sections: [
      {
        heading: "manual and automatic mode",
        items: [
          "The dashboard has two buttons, Manual and Auto, which write mode = \"MANUAL\" or \"AUTO\" to devices/<uid>/settings. The exact same strings are used in the ESP32 sketch (this is where my AUTO vs AUTOMATIC bug came from)",
          "Manual: the bulb button writes bulbCommand = \"ON\" or \"OFF\" to settings. The ESP32 checks that every second and switches the relay, then writes the real state back to current/bulbState so the dashboard shows what the bulb is actually doing",
          "Auto: the ESP32 ignores bulbCommand and decides on its own from the LDR, checking every 500 ms. The bulb button is disabled on the dashboard while in Auto so the two can't fight",
          "The ESP32 re-reads the mode and threshold from Firebase every 2 seconds, so switching modes takes effect almost immediately without reflashing anything",
        ],
      },
      {
        heading: "how I calibrate the LDR threshold",
        items: [
          "The LDR value is a raw 12-bit ADC reading (0 to 4095), and I average 15 samples per reading to smooth out noise",
          "With my LDR module, a darker room gives a higher number, so the bulb turns on when the value goes above the threshold",
          "To pick the number, I watch the live LDR value on the dashboard in normal room light and again with the sensor covered, then set the threshold somewhere between the two",
          "I type it into the threshold box on the dashboard and hit save. It's stored at settings/ldrThreshold (default 500 in the code), and the ESP32 picks it up within about 2 seconds, so I can retune it without reflashing the board",
          "Because the LDR sits close to the bulb and sees its light, the relay only turns ON above threshold + 300 and OFF below threshold − 300. Between those two the bulb keeps whatever state it was in, which stopped the flickering. So the threshold should be picked so both edges still sit inside my bright and dark readings",
        ],
      },
      {
        heading: "how the logs are stored",
        body: `Every 3 seconds the ESP32 pushes one new record under devices/<uid>/logs with push(), so Firebase gives each reading its own unique key instead of overwriting the last one. Each record has temperature, humidity, ldr, bulbState and mode, plus a timestamp that Firebase fills in itself on the server (milliseconds since 1970), so I don't need the ESP32 to know the time. The structure is in the code block below.`,
      },
      {
        heading: "history, chart and CSV export",
        body: `The dashboard listens to the logs path and fills a history table (newest first) and a Chart.js line graph of temperature, humidity and LDR. The Download CSV button reads the same logs once, builds a text file in the browser (header: Timestamp, Temperature, Humidity, LDR, BulbState, Mode, then one row per record) and downloads it as a .csv, so the exported file has exactly what's recorded in Firebase.`,
      },
    ],
    hardware: ["Same hardware as Task 4 — ESP32, DHT11, LDR, relay + bulb", "Firebase Realtime Database", "Custom dashboard front-end with charts + CSV export"],
    diagram: "DHT11 + LDR --> ESP32 --> Firebase /current (live) + /logs (history)\nDashboard --> /settings --> ESP32 --> Relay --> Bulb",
    wiring: ["Identical wiring to Task 4 — this task is firmware, database structure, and dashboard logic, not new hardware"],
    configuration: [
      "Standardized both the dashboard and ESP32 on one device path: /devices/<uid>/current, /settings, /logs",
      "Confirmed Firebase rules still scoped access to the authenticated user's own device path after restructuring",
      "Set the LDR threshold through the dashboard UI rather than hardcoding it, so it can be retuned without reflashing the board",
    ],
    code: [
      {
        label: "Realtime Database structure (logs, current, settings)",
        code: `devices/
  <uid>/                       <- the logged-in user's UID
    current/                   <- live snapshot, overwritten every 3 s
      temperature, humidity, ldr, bulbState ("ON"/"OFF"), mode
    settings/                  <- written by the dashboard
      mode ("MANUAL"/"AUTO"), ldrThreshold, bulbCommand ("ON"/"OFF")
    logs/                      <- history, one entry per reading
      -Nabc123.../             <- unique key from push()
        temperature, humidity, ldr, bulbState, mode,
        timestamp              <- Firebase server time (ms)`,
      },
      {
        label: "esp32_logging_automation.ino — main loop",
        code: `#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include "DHT.h"

#define WIFI_SSID       "YOUR_WIFI_SSID"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

#define API_KEY "YOUR_FIREBASE_API_KEY"

#define USER_EMAIL      "YOUR_FIREBASE_USER_EMAIL"
#define USER_PASSWORD   "YOUR_FIREBASE_USER_PASSWORD"

#define DATABASE_URL "https://YOUR_PROJECT_ID-default-rtdb.YOUR_REGION.firebasedatabase.app"

#define DEVICE_ID "YOUR_FIREBASE_USER_UID"

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
  json += "\"temperature\":" + String(temperature, 1);
  json += ",\"humidity\":" + String(humidity, 1);
  json += ",\"ldr\":" + String(ldrValue);
  json += ",\"bulbState\":\"" + String(relayState ? "ON" : "OFF") + "\"";
  json += ",\"mode\":\"" + mode + "\"";
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

  json += "\"temperature\":";
  json += String(temperature, 1);

  json += ",\"humidity\":";
  json += String(humidity, 1);

  json += ",\"ldr\":";
  json += String(ldrValue);

  json += ",\"bulbState\":\"";
  json += relayState ? "ON" : "OFF";
  json += "\"";

  json += ",\"mode\":\"";
  json += mode;
  json += "\"";

  json += ",\"timestamp\":{\".sv\":\"timestamp\"}";

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
}`,
      },
    ],
    challenges: [
      "My dashboard and ESP32 were pointing at two different device IDs, so neither could see the other's data. Fixed by using the same ID everywhere.",
      "The dashboard was reading live values from \"current\" and history from \"logs,\" but my ESP32 was only writing to a completely different path — so both stayed empty until I split the writes properly.",
      "The dashboard sent \"AUTO\" as the mode, but my firmware was checking for \"AUTOMATIC.\" One word mismatch, and auto mode just silently never triggered.",
      "Bulb control was a mess of mismatched types and paths — the dashboard sent a string command to one path, the firmware expected a boolean on a totally different one. Had to standardize both sides.",
      "My LDR got stuck reading 4095 no matter what I did — turned out to be a wiring issue, not code. I isolated it with a standalone test sketch with no Firebase involved at all, just to confirm it was hardware before touching anything else.",
      "Once the LDR was actually working, auto mode felt laggy, because the relay check was stuck inside the same slow loop that pushed data to Firebase every few seconds. Gave it its own faster loop.",
      "Then I noticed the bulb's own light was messing with the LDR reading since it sits close by, causing it to swing to the extremes and flicker. That's what the hysteresis buffer above was actually for.",
    ],
    reflection: `Most of the real learning was in the bugs, not the features — a single word mismatch (AUTO vs AUTOMATIC) taught me more about careful naming than any tutorial could. Limitations for now: the threshold is set manually rather than auto-calibrated to the room, and the LDR still picks up some of the bulb's own light since it's positioned nearby. Next thing I'd improve is moving the LDR further from the bulb and auto-calibrating the threshold instead of setting it by hand.`,
    images: [
      "assets/iot/sensor-wiring.png",
      "assets/iot/dashboard-1.png",
      "assets/iot/dashboard readings.png",
      "assets/iot/dashboard readings-2.png",
      "assets/iot/database.png",
      "assets/iot/logs1.png",
    ],
    videos: [
      "assets/iot/dashboard readings.mp4",
    ]
  },
];