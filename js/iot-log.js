// ============================================================
// INTERNET OF THINGS LOG
// ------------------------------------------------------------
// HOW TO ADD A NEW ENTRY:
// 1. Copy one entry block below (or the template block), paste it
//    right before the closing "];" (newest entry goes LAST, at the
//    bottom of the list)
// 2. Fill in date / title / text
// 3. Optional: add an "images" array (paths to photos) — if present,
//    they'll show as a stacked photo pile at the bottom of the entry
//    popup, and clicking the stack opens a left/right scrollable
//    lightbox through all of them.
//
// TEMPLATE TO COPY:
// {
//   date: "2026-09-01",
//   title: "Entry title",
//   text: `What you worked on, what you learned, what's next.`,
//   images: [
//     "assets/iot/your-photo-1.jpg",
//     "assets/iot/your-photo-2.jpg",
//   ],
// },
// ============================================================

const iotLog = [
  {
    date: "2026-09-01",
    title: "Task 1 — Controlling an LED over HTTP",
    text: `For this one I turned my ESP32 into its own tiny web server, just so I could switch its built-in LED on and off from a browser — no app, no cloud, nothing extra involved.

I connected it to my Wi-Fi using WiFi.h, then used WebServer.h to set up two routes — /on and /off — that just flip the LED pin whenever the browser hits them. The LED is the built-in one on GPIO2, so I didn't even need extra components for this one, just the board itself.

It's basically a request-response loop: browser sends /on or /off, ESP32 gets the request, flips the pin, replies. Simple, but it only works if I'm on the same Wi-Fi network as the board — and that limitation is exactly what pushed me into Task 2.`,
    images: [
      "assets/iot/led-switch.png"
      
    ],
  },
  {
    date: "2026-09-04",
    title: "Task 2 — MQTT dashboard controlling a real bulb",
    text: `Here I moved off the local network completely. I set up an Adafruit IO dashboard with a switch, and that switch now controls an actual 230V bulb through a relay — from anywhere with internet, not just my home Wi-Fi.

Components were the ESP32, a 5V relay module (SRD-05VDC-SL-C), and the bulb itself. GPIO26 goes to the relay's IN pin, and on this relay, GPIO26 HIGH means the coil turns on. Only the bulb's Live wire runs through the relay's COM → NO contacts — Neutral goes straight to the bulb and is never switched, which matters a lot when you're dealing with mains voltage.

MQTT works pretty differently from HTTP. Instead of me asking the ESP32 for something, it just subscribes to a "feed" on Adafruit IO, and the moment the dashboard publishes ON or OFF, it reacts instantly. I also tested the relay logic with a safe low-voltage signal first before I let it anywhere near the actual mains wiring — wasn't about to skip that step.`,
    images: [
      "assets/iot/relay-switch.png",
      "assets/iot/relay-wiring.png",
  
    ],
  },
  {
    date: "2026-09-07",
    title: "Task 3 — Turning the bulb on with my voice",
    text: `Same exact hardware as Task 2, no rewiring at all — I just added a voice layer on top of it. Now saying "Hey Google, turn on the bulb" controls the same relay.

I set up an IFTTT applet with Google Assistant as the trigger and a Webhooks action that posts straight to the same Adafruit IO feed the ESP32 was already listening to. The part I found genuinely interesting: I didn't have to touch the firmware at all. The ESP32 has no idea whether a value on its feed came from someone tapping the dashboard or from a voice command — it just reacts either way. Once the plumbing from Task 2 was right, this was almost entirely a no-code layer on top.`,
    images: [
      "assets/iot/google-assistant.png",
      
    ],
  },
  {
    date: "2026-09-11",
    title: "Task 4 — Building my own Firebase dashboard",
    text: `This is where I moved off Adafruit IO entirely and built my own dashboard from scratch, backed by Firebase — complete with a login page and live sensor readings instead of just a switch.

Components this time: ESP32, a DHT11 for temperature and humidity, an LDR for light, and the same relay + bulb setup. DHT11 data goes to GPIO4, the LDR's analog output goes to GPIO34, and the relay stays on GPIO26.

A couple of things I had to actually sit down and understand for this one instead of just plugging in and going: Firebase is a BaaS — Backend-as-a-Service — so it hands you a ready-made database and login system instead of you building your own backend server. The Realtime Database keeps everything in sync automatically, so I'm not sitting there refreshing the page hoping for new data. I also finally got the difference between authentication and authorization straight in my head: authentication is Firebase checking that my email and password are correct, authorization is making sure I can only read and write my own device's data, not anyone else's.`,
    images: [
      "assets/iot/dashboard.png",
      "assets/iot/dashboard-1.png",
      "assets/iot/database.png",
      "assets/iot/auth.png"

    ],
  },
  {
    date: "2026-09-15",
    title: "Task 5 — Logging, automation, and a whole lot of debugging",
    text: `This last one pulled everything together — manual and automatic bulb control, a full history of readings, and CSV export. Honestly, most of the actual work here wasn't building new features, it was debugging, because my dashboard and firmware had been built a bit separately and didn't actually agree with each other.

The final structure ended up being one device path with three parts: a "current" branch for live values (temperature, humidity, LDR reading, bulb state, mode), a "settings" branch for mode/threshold/commands, and a "logs" branch for timestamped history, one entry per reading.

Automatic mode compares the LDR reading against a threshold I set on the dashboard, but with a small buffer zone around it rather than one exact cutoff — otherwise the relay just kept flickering right at the edge.

Honestly, the bugs were most of the real learning here:
— My dashboard and ESP32 were pointing at two different device IDs, so neither could see the other's data. Fixed by using the same ID everywhere.
— The dashboard was reading live values from "current" and history from "logs," but my ESP32 was only writing to a completely different path — so both stayed empty until I split the writes properly.
— The dashboard sent "AUTO" as the mode, but my firmware was checking for "AUTOMATIC." One word mismatch, and auto mode just silently never triggered.
— Bulb control was a mess of mismatched types and paths — the dashboard sent a string command to one path, the firmware expected a boolean on a totally different one. Had to standardize both sides.
— My LDR got stuck reading 4095 no matter what I did — turned out to be a wiring issue, not code. I isolated it with a standalone test sketch with no Firebase involved at all, just to confirm it was hardware before touching anything else.
— Once the LDR was actually working, auto mode felt laggy, because the relay check was stuck inside the same slow loop that pushed data to Firebase every few seconds. Gave it its own faster loop.
— Then I noticed the bulb's own light was messing with the LDR reading since it sits close by, causing it to swing to the extremes and flicker. That's what the hysteresis buffer above was actually for.

Limitations for now: the threshold is set manually rather than auto-calibrated to the room, and the LDR still picks up some of the bulb's own light since it's positioned nearby. Next thing I'd improve is moving the LDR further from the bulb and auto-calibrating the threshold instead of setting it by hand.

After finally getting this all working with multiple rounds of debugging, I can see why people often just buy a ready-made smart bulb instead of building their own — but I also learned a lot more about how the plumbing works behind the scenes, and that was the whole point of this project.`,
    images: [
      "assets/iot/sensor-wiring.png",
      "assets/iot/dashboard-1.png",
      "assets/iot/dashboard readings.png",
      "assets/iot/dashboard readings-2.png",
      "assets/iot/database.png",
      "assets/iot/logs1.png"

    ],
  },
];
