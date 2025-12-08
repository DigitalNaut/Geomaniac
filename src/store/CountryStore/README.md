# Handling of Country Features from Natural Earth Data

## Country Store

Here we transform the country data into a more usable format.

A user can filter by:

- Type: Whether the country is self-governed or not
- Transform from [Country, SovereigntCountry, Sovereignty]
- Sovereignt: The sovereign country's name
- Admin: A self-regulating body
- Geounit: Land unit with distinctive features

### Sorting by Type

The data for TYPE is transformed from [Country, SovereigntCountry, Sovereignty] to [Country, Sovereignty]

This is done by grouping:

- Country
- Sovereignty:
  - SovereigntCountry
  - Sovereignty

### Sorting by
