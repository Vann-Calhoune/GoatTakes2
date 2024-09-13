# GoatTakes2

This application provides a comprehensive view of NBA statistics and rankings, powered by the NBA API.

## Application Overview

The application has three pages:

1. **Home Page**: 
   - Displays live stat leaders for Points, Rebounds, Assists, Blocks, and Steals.
   - Shows live standings for each conference (Eastern and Western).

2. **Rank Page**: 
   - Allows users to rank the NBA 75th Anniversary Team with a drag-and-drop interface.

3. **Compare Page**: 
   - Enables users to compare player stats.
   - You can enter one player's name to view their stats or two players' names to compare both of their career stats.

## Powered By

- NBA API

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Vann-Calhoune/GoatTakes2.git
   cd GoatTakes2

2. **Set up and activate virtual environemtn**   (optional)

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

3. **Install dependencies**

    ```bash
    pip install --upgrade pip
    pip install -r requirements.txt

4. **Start backend**

  ```bash
    backend/python server.py

```
5. **Start Frontend**

  ```
    npm install
    npm start
