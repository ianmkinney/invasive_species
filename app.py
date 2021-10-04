from flask import Flask, request, jsonify, render_template
app = Flask(__name__, template_folder='templates')

@app.route('/')
def home():
    return render_template("native.html")

@app.route('/introduced')
def introduced():
    return render_template("introduced.html")

@app.route('/threatened')
def threatened():
    return render_template("threatened.html")

if __name__ == '__main__':
    app.run(threaded=True, port=5000)