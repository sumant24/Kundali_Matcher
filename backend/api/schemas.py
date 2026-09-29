from marshmallow import Schema, fields, validate


class PersonAstrologySchema(Schema):
    full_name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    rashi = fields.String(required=True, validate=validate.Length(min=2, max=50))
    nakshatra = fields.String(required=True, validate=validate.Length(min=2, max=50))
    nakshatra_charan = fields.Integer(load_default=1, validate=validate.Range(min=1, max=4))
    lagna = fields.String(load_default="Vrishchik", validate=validate.Length(min=2, max=50))
    mars_house_from_lagna = fields.Integer(load_default=1, validate=validate.Range(min=1, max=12))
    mars_house_from_moon = fields.Integer(load_default=10, validate=validate.Range(min=1, max=12))


class MatchRequestSchema(Schema):
    bride = fields.Nested(PersonAstrologySchema, required=True)
    notes = fields.String(load_default=None, allow_none=True)
