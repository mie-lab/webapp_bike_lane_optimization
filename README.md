
# Webapp Bike Lane Optimization

Web app for planning bike infrastructure and accessing the algorithm of @NinaWie.

### Installation

Install dependencies and run development server with the following commands:

````
git clone https://github.com/mie-lab/webapp_bike_lane_optimization.git
cd frontend
npm install
npm run dev
````

To build and test, use the following commands:

````
npm run build
npm run preview
````


### Files and directories

The application is build with Vue.js 3, using Node.js as a runtime environment. Additional  and APIs used are `Pinia` and `Mapbox GL JS`.

* `assets`: graphical elements, like png's and SVG's
* `components`: vue components
* `scripts`: JavaScript files containg functions
* `stores`: Pinia store files
* `strings`: JavaScript files containing text strings
* `styles`: CSS files

### Backend

To pull the backend and start development server

````
cd backend
git clone https://github.com/mie-lab/bike_lane_optimization.git
pip install -r requirements.txt
python app.py
````





