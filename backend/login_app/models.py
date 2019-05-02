from login_app import app,db,auth
from werkzeug.security import generate_password_hash,check_password_hash
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

class User(db.Model):
	__tablename__='user'

	created_at = db.Column('created_at', db.DateTime(timezone=True), default=db.func.current_timestamp())
	updated_at = db.Column('updated_at', db.DateTime(timezone=True), default=db.func.current_timestamp(),onupdate=db.func.current_timestamp())
	
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64), unique=True)
	email = db.Column(db.String(128), unique=True)
	password_hash = db.Column(db.String(128))
	img_src = db.Column(db.String(128))
	likes = db.Column(db.Integer)
	
	@property
	def password(self):
		raise AttributeError('password is not a readable attribute')
	
	@password.setter
	def password(self, password):
		self.password_hash = generate_password_hash(password)
	
	def verify_password(self, password):
		return check_password_hash(self.password_hash, password)

	def generate_auth_token(self, expiration=600):
		s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
		return s.dumps({'id': self.id})

	@staticmethod
	def verify_auth_token(token):
		s = Serializer(app.config['SECRET_KEY'])
		try:
		    data = s.loads(token)
		except SignatureExpired:
		    return None    # valid token, but expired
		except BadSignature:
		    return None    # invalid token
		user = User.query.get(data['id'])
		return user


class superlike(db.Model):
	__tablename__='superlike'

	created_at = db.Column('created_at', db.DateTime(timezone=True), default=db.func.current_timestamp())
	updated_at = db.Column('updated_at', db.DateTime(timezone=True), default=db.func.current_timestamp(),onupdate=db.func.current_timestamp())
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	from_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	event_type = db.Column(db.Integer)
	user = db.relationship('User', foreign_keys=user_id)
	_from = db.relationship('User', foreign_keys=from_user)