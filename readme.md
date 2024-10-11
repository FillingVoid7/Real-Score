# ⚽ Real Score - Live Soccer Scorer Chrome Extension

![Icon](images/icon-128.png)

### A minimalistic and real-time soccer scorer extension using the [football-data.org](https://www.football-data.org/) API.

---

## 📖 Overview

**Real Score** is a simple and sleek Chrome extension designed to keep soccer enthusiasts updated with live scores, match statistics, and standings. Whether you're tracking your favorite team or monitoring live matches, Real Score provides all the essential data right within your browser.

---

## 🚀 Features

- **Team Search and Selection:** Easily search for and select your favorite teams.
- **Live Match Updates:** Receive real-time notifications for ongoing matches, including goals and important events.
- **Upcoming Matches:** View the schedule for your team's upcoming matches, complete with date, time, and opponent details.
- **Recent Matches:** Stay informed about your team's past performance with full-time results and match statistics.
- **Player Statistics:** Access detailed player data, including top goal scorers, assists, and more.
- **League Standings:** Follow live standings for major leagues (e.g., Premier League, La Liga).
- **Switch Between Competitions:** Track multiple competitions your team is participating in.
- **Real-time Push Notifications:** Enable push notifications for real-time updates during live matches.

---

## 🖥 Full Page View

Unlike most extensions that limit information to a small popup, **Real Score** offers a **full-page view** experience. Get a complete, detailed view of matches, stats, and more with just one click!

---

## 📦 Installation

1. **Clone or Download the Extension:**
    ```bash
    git clone https://github.com/your-repo/real-score.git
    ```

2. **Add the Extension to Chrome:**
   - Navigate to `chrome://extensions/`.
   - Enable **Developer Mode** (toggle in the top-right corner).
   - Click on **Load unpacked** and select the `Real Score` project folder.

3. **Enjoy the Real-time Soccer Experience!**

---

## 📚 How to Use

1. **Search for a Team:**
   - Open the extension by clicking on the icon in your toolbar.
   - Use the search bar to find your favorite team.
   - Click on the team name to select it and save it for future use.

2. **View Team Info:**
   - The full-page view will display upcoming and recent matches, live scores, and player statistics for your team.

3. **Get Real-time Updates:**
   - Enable notifications to receive live updates for goals, red cards, and other key events.

---

## 🛠 Tech Stack

- **Manifest V3:** Chrome extension framework.
- **JavaScript (ES6):** Core programming language used.
- **HTML & CSS:** For structuring and styling the user interface.
- **[football-data.org](https://www.football-data.org/) API:** Fetching live match data, player stats, and standings.

---

## ⚙️ API Configuration

This extension uses the [football-data.org](https://www.football-data.org/) API to gather live match data and statistics. To use the extension:

1. **Sign up** on [football-data.org](https://www.football-data.org/) to get your free API key.
2. In the `api.js` file, replace the `API_KEY` with your own key:
    ```javascript
    const API_KEY = 'YOUR_API_KEY_HERE';
    ```

---

## 📸 Screenshots

### Main Page

![Main Page](images/screenshot-main-page.png)

### Live Match Notification

![Live Match Notification](images/screenshot-notification.png)

---

## 🎯 Future Features

- **Dark Mode:** A sleek dark theme option for nighttime browsing.
- **Favorite Players:** Track your favorite players alongside your favorite team.
- **Match Highlights:** Watch video highlights directly within the extension.

---

## 🙌 Contributing

We welcome contributions to improve the extension. To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add my feature'`).
4. Push the branch (`git push origin feature/my-feature`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **Football-Data.org** for providing an excellent API to retrieve soccer data.
- **Google Chrome Extensions** for a powerful platform to build browser tools.
