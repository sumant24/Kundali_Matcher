from marshmallow import Schema, fields, validate


class PersonAstrologySchema(Schema):
    full_name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    rashi = fields.String(required=True, validate=validate.Length(min=2, max=50))
    nakshatra = fields.String(required=True, validate=validate.Length(min=2, max=50))
    nakshatra_charan = fields.Integer(load_default=1, validate=validate.Range(min=1, max=4))
    gana = fields.String(load_default=None, allow_none=True)
    gotra = fields.String(load_default=None, allow_none=True)
    manglik_status = fields.String(load_default="Non-Manglik", allow_none=True)
    lagna = fields.String(load_default="Vrishchik", allow_none=True)
    mars_house_from_lagna = fields.Integer(load_default=1, allow_none=True)
    mars_house_from_moon = fields.Integer(load_default=10, allow_none=True)


class MatchRequestSchema(Schema):
    bride = fields.Nested(PersonAstrologySchema, required=True)
    notes = fields.String(load_default=None, allow_none=True)
