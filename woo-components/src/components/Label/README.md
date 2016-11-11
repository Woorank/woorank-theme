# Label

Example:

    <Label>Heya!</Label>

Colors:

    <div style={{ width: '250px', margin: 'auto' }}>
      <Label>Default</Label>
      <Label style='primary'>Primary</Label>
      <Label style='success'>Success</Label>
      <Label style='warning'>Warning</Label>
      <Label style='danger'>Danger</Label>
    </div>

Omitting background:

    <div style={{ width: '250px', margin: 'auto' }}>
      <Label noBackground>Default</Label>
      <Label style='primary' noBackground>Primary</Label>
      <Label style='success' noBackground>Success</Label>
      <Label style='warning' noBackground>Warning</Label>
      <Label style='danger' noBackground>Danger</Label>
    </div>

Additional properties:

    <div style={{ width: '250px', margin: 'auto' }}>
      <Label title='See! I have an additional property, title :)'>Hover over me!</Label>
    </div>
