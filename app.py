from flask import Flask, request, jsonify, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return "<h1>Invasive Species in Georgia</h1>"

if __name__ == '__main__':
    app.run(threaded=True, port=5000)