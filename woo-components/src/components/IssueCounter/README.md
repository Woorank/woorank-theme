# IssueCounter

Passive:

    <div style={{ width: '200px', margin: 'auto' }}>
      <IssueCounter label='Meta title issues' amount={20} />
    </div>

Active, with a tooltip:

    <div style={{ width: '200px', margin: 'auto' }}>
      <IssueCounter active label='Meta title issues' amount={20}
        tooltip='I am a helpful tip' />
    </div>

Full row:

    <div style={{ display: 'flex',  }}>
      <IssueCounter active tooltip='I am a helpful tip' label='Meta title issues' amount={20} />
      <IssueCounter label='Meta description issues' amount={73} />
      <IssueCounter label='H1 Tag issues' amount={12} />
      <IssueCounter label='Body content issues' amount={93} />
    </div>
