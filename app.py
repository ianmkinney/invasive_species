from flask import Flask, request, jsonify, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('templates/index.html')

if __name__ == '__main__':
    app.run(threaded=True, port=5000)