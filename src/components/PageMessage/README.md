This component is intended to display a notification message at the bottom of the screen.
The idea is that any component anywhere in the app that wants to display a message will just render one of these with the message.
This component will handle rendering them relative to eachother and above all other content.
Messages will be removed when whatever originally rendered them no longer renders them.

Original use case for this was displaying error messages from APIs.
Rather than setting state on some parent component or trying to render an error message within a component,
this is a dead simple way to show the message on the screen regardless of size or location of the component that wants it rendered.

Whichever instance is rendered first will be on the bottom of the page.
Further instances are rendered above it.
If too many are displayed they will be outside the rendered area of the page.
When one is no longer rendered, any that were above it will automatically move down.
