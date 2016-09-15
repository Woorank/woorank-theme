# Badge

Example:

    <div>
    {
      [0,1,2,3,10,11,100,110,'abc','and something different'].map(i =>
        <Badge key={i} value={i.toString()} style={{ margin: '5px' }} />)
    }
    </div>

Different sizes

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Badge value='10px' style={{ margin: '5px', fontSize: '10px' }} />
      <Badge value='12px' style={{ margin: '5px', fontSize: '12px' }} />
      <Badge value='14px' style={{ margin: '5px', fontSize: '14px' }} />
      <Badge value='16px' style={{ margin: '5px', fontSize: '16px' }} />
      <Badge value='18px' style={{ margin: '5px', fontSize: '18px' }} />
      <Badge value='20px' style={{ margin: '5px', fontSize: '20px' }} />
      <Badge value='32px' style={{ margin: '5px', fontSize: '32px' }} />
    </div>

Within label

    <div style={{ width: '250px', margin: 'auto' }}>
      <Label>
        <span>Multiple items</span><Badge value='8' />
      </Label>

      <Label style='primary'>
        <span>Multiple items</span><Badge value='11' />
      </Label>

      <Label style='success'>
        <span>Multiple items</span><Badge value='abc' />
      </Label>

      <Label style='warning'>
        <span>Multiple items</span><Badge value='∞' />
      </Label>

      <Label style='danger'>
        <span>Multiple items</span><Badge value='0' />
      </Label>
    </div>
