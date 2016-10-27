# Badge

Example:

    <div>
    {
      [0,1,2,3,10,11,100,110,'abc','and something different'].map(i =>
        <Badge key={i} style={{ margin: '5px' }}>
          {i.toString()}
        </Badge>)
    }
    </div>

Different sizes

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Badge style={{ margin: '5px', fontSize: '10px' }}>
        10px
      </Badge>
      <Badge style={{ margin: '5px', fontSize: '12px' }}>
        12px
      </Badge>
      <Badge style={{ margin: '5px', fontSize: '14px' }}>
        14px
      </Badge>
      <Badge style={{ margin: '5px', fontSize: '16px' }}>
        16px
      </Badge>
      <Badge style={{ margin: '5px', fontSize: '18px' }}>
        18px
      </Badge>
      <Badge style={{ margin: '5px', fontSize: '20px' }}>
        20px
      </Badge>
      <Badge style={{ margin: '5px', fontSize: '32px' }}>
        32px
      </Badge>
    </div>

Within label

    <div style={{ width: '250px', margin: 'auto' }}>
      <Label>
        <span>Multiple items</span><Badge>8</Badge>
      </Label>

      <Label style='primary'>
        <span>Multiple items</span><Badge>11</Badge>
      </Label>

      <Label style='success'>
        <span>Multiple items</span><Badge>abc</Badge>
      </Label>

      <Label style='warning'>
        <span>Multiple items</span><Badge>∞</Badge>
      </Label>

      <Label style='danger'>
        <span>Multiple items</span><Badge>0</Badge>
      </Label>
    </div>

With an Icon

Badge supports icons right out of the box, just wrap them inside!

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Badge style={{ margin: '5px', color: '#d3860c' }}>
        <Icon type='reload' />
      </Badge>
      <Badge style={{ margin: '5px' }}>
        <Icon type='gear' />
      </Badge>
    </div>
