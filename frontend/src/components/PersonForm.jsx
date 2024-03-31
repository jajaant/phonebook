const PersonForm = ({personForm}) => {
  const {onSubmit, contacts} = personForm
  return (
    <form onSubmit={onSubmit}>
      {contacts.map((contact) => (
        <div key={contact.id}>
          <div>
            {contact.nameText}: <input value={contact.nameValue} onChange={contact.nameChange} /><br/>
            {contact.numberText}: <input value={contact.numberValue} onChange={contact.numberChange} />
          </div>
        </div>
      ))}
      <button type="submit">add</button>
    </form>
  )
}



export default PersonForm