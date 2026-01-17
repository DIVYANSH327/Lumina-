# GENRUN | Premium Run & Rave Collective

GENRUN is a high-energy, technology-driven sports community platform designed for the weekend runners and electronic music enthusiasts of **Bhopal** and **Indore**, Madhya Pradesh.

![GENRUN Header](https://images.pexels.com/photos/1555351/pexels-photo-1555351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## ⚡ Core Features

- **Hub Registration**: Dual-node support for Bhopal (Upper Lake) and Indore (Super Corridor).
- **Secure QR Protocol**: High-correction QR codes with **One-Time Use (OTU)** security logic and anti-fraud duplicate detection.
- **Admin Terminal**: A secure dashboard featuring a live "Smart" Auto-Scanner and real-time directory synchronization.
- **AI Coach (GENRUN-AI)**: Integrated Gemini-powered assistant for motivation, local route advice, and community engagement.
- **Digital Pass Management**: Instant generation of PDF tickets with unique Auth Tokens and Prep Guides.
- **Legal Compliance Hub**: Integrated policies for Razorpay/Payment Gateway activation (Refunds, Privacy, Terms, and Shipping).

## 🛠 Tech Stack

- **Framework**: React 19 (Import-map based)
- **Styling**: Tailwind CSS + Glassmorphism UI
- **Animations**: Framer Motion
- **Scanner**: jsQR (Managed Canvas/Video Engine)
- **PDF Generation**: jsPDF
- **Intelligence**: Google Gemini API (gemini-3-flash-preview)
- **Data Hub**: Cloud Sync via MockAPI (Persistence Layer)

## ⚖️ Razorpay Compliance
This platform includes a dedicated Policy Hub accessible via the footer to satisfy Indian payment gateway requirements:
- **Terms of Service**: Collective ethics and usage rules.
- **Privacy Policy**: Secure handling of runner identity data.
- **Refund Policy**: Zero-refund digital fulfillment protocol.
- **Shipping Policy**: Instant digital delivery of Hub IDs.
- **Contact**: Operational support details for Node 01.

## 🚀 Local Setup

1. Clone this repository.
2. Ensure you have an environment variable `API_KEY` set for the Google Gemini API.
3. Open `index.html` in a local server environment (e.g., Live Server).

---
*Built for the community. Run the Rave.*
