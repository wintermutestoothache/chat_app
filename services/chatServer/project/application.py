from flask import Flask, render_template,jsonify, request, session, redirect
from flask_session import Session
from flask_socketio import SocketIO, join_room, emit
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, current_user, logout_user
import os
from project.models import *


app = Flask(__name__)

app_settings = os.getenv('APP_SETTINGS')
app.config.from_object(app_settings)
app.config['SESSION_TYPE'] = 'filesystem'
socketio = SocketIO(app)
Session(app)
login_manager = LoginManager(app)
db.init_app(app)

messages = []

@app.route('/chat')
def index():
    return render_template('index.html', messages=messages)

@app.route('/chat/login',methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        if current_user.is_authenticated:
            return redirect("http://localhost",code=302)
        else:
            username = request.form['username']
            if not User.query.filter_by(username=username):
                u = User(username=username)
                db.session.add(u)
                db.session.commit()
            else:
                u = User.query.filter_by(username=username)
                login_user(u)



        return redirect("http://localhost",code=302)

    else:
        return render_template('login.html')

@socketio.on('connect')
def testCook():
    if session['testAreYouThere']:
        emit('connect_response',{'cookiePresent':True})
    else:
        emit('connect_response',{'cookiePresent':False})

@socketio.on("test")
def on_test(data):
    print(data)
    emit('test_passed',{"didIDoIt":"yesYouDid"},broadcast=True)

@socketio.on('sendMessage')
def message_received(data):
    messages.append(data['message'])
    emit('gotMessage',{"newMessage":data['message']}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port='5000')