from flask import Flask
from login_app import app,db
from flask_script import Manager, Server,Shell
from login_app.models import User

@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User)

manager = Manager(app)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command("runserver", Server(port=5002,threaded=True,use_debugger=True))

if __name__ == '__main__':
	manager.run()