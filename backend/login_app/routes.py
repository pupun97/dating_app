from login_app import app,auth,db
from flask import jsonify, request, abort, g, session
from login_app.models import User
from flask_httpauth import HTTPBasicAuth
import time

class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

@app.route('/')
def index():
	return 'login API'

# @app.route('/login',methods=['POST'])
# def login():
# 	if request.method == 'POST':
# 		args = request.json
# 		email=args['email']
# 		password=args['password']
# 		user=User.query.filter_by(email=email).all()
# 		print(request.json)
# 		if user:
# 			user=user[0] = db.Column(db.String(64), unique=True)
# 	email = db.Column(db.String(128), unique=True)
# 	password_hash = db.Column(db.String(128))
	

@app.route('/login',methods=['GET'])
@auth.login_required
def get_auth_token():
	# print(request.headers,'ytdjrxrsz')
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600,'user':{'email':g.user.email,'name':g.user.name,'likes':g.user.likes}})

@app.route('/register',methods=['POST'])
def register_user():
    password=request.authorization.password
    username=request.authorization.username
    link=request.json['img']
    print(password,username,'register\n')
    user=User.query.filter_by(email=username).first()
    if user:
        return('Username already registered',411)
    else:
        new_user=User(email=username,password=password,img_src=link)
        db.session.add(new_user)
        db.session.commit()
    token=new_user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600,'user':username,'message':'succesfuly added'})


@app.route('/verify',methods=['GET'])
@auth.login_required
def verify():
	return 'Verified'

@app.route('/image',methods=['GET'])
# @auth.login_required
def get_images():
    users=User.query.all()
    res={}
    for user in users:
        res[user.email]={'image':user.img_src,'likes':user.likes,'email':user.email}
    return jsonify({'data':res})

# @auth.login_required
@app.route('/like',methods=['GET'])
def like():
    print('request is coming')
    userEmail=request.json['userEmail']
    user=User.query.filter_by(email=userEmail).first()
    if user:
        user.likes+=1
        db.session.add(user)
        db.session.commit()
        return 'like updated'
    else:
        return ('User not exist',404)

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
