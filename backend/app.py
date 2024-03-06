import os
from flask_app import create_app
app = create_app()
if __name__ == '__main__':
    app.run(host = '0.0.0.0',
            port=int(os.environ.get("port",8088)),
            use_reloader=True,
            debug=True) 