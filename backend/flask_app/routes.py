from flask import current_app as app

@app.route('/')
def root():
    return app.send_static_file('index.html')