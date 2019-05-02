from flask import Flask,g,Response,abort
from flask_sqlalchemy import SQLAlchemy
import os
from flask_httpauth import HTTPBasicAuth


app=Flask(__name__)

db=SQLAlchemy(app)
auth = HTTPBasicAuth()

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] ='sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SECRET_KEY'] = 'puneet jain'



from login_app.routes import InvalidUsage
import login_app.routes

from login_app.models import User
@auth.verify_password
def verify_password(username_or_token, password):
	print(username_or_token,password,'adtfqwytdcwytd')
	# first try to authenticate by token
	user = User.verify_auth_token(username_or_token)
	if not user:
	    # try to authenticate with username/password
	    user = User.query.filter_by(email=username_or_token).first()
	    if not user or not user.verify_password(password):
	    	raise InvalidUsage('email or password is wrong', status_code=401)
	g.user = user
	return True


