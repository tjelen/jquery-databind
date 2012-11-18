# jquery-databind

Trigger hub messages on element events, configured by data-on attribute.
Works only events that bubble.

## Examples: 

    <a class="close" data-on="click:app.close"></a>

    <input type="text" name="email" data-on="click:validate(email)">