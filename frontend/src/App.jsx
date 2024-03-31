import {useState, useEffect} from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import contactService from './services/contacts'


const App = () => {
  // Tilamuuttujien alustus
  const [persons, setPersons] = useState([]) //Yhteystiedot
  const [newName, setNewName] = useState('') // Uuden yhteystiedon nimi
  const [newNumber, setNewNumber] = useState('') // Uuden yhteystiedon puhelinnumero
  const [notification, setNotification] = useState(null) // Yhteystiedon lisäyksen ja poiston ilmoitukset
 
  // haetaan yhteystiedot palvelimelta sovelluksen käynnistyessä
  useEffect(() => {
    contactService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])
  
  // Uuden yhteystiedon lisäävä funktio
  const addContact= (event) => {
    event.preventDefault()

    // Tarkistetaan, onko nimi tai numero tyhjä
  if (newName.trim() === '' || newNumber.trim() === '') {
    alert('Name or number cannot be empty') // Näytetään ilmoitus käyttäjälle
    return // Keskeytetään funktion suoritus, jos jompikumpi on tyhjä
  }
    // Etsitään, onko annettu nimi jo olemassa persons -taulukossa. Kirjainten koolla ei väliä
    //const nameExists = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    
    // Jos nimeä ei löydy, luodaan uusi yhteystieto-olio.
    //if (!nameExists) {
      const contactObject = {
        name: newName,
        number: newNumber
      }
      // Lähetetöön uusi yhteystieto palvelimelle ja päivitetään tilaa vastaamaan muutosta
      contactService
        .create(contactObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNotification({message: `Added ${response.name}`, type: 'add'}) // Näytetään lisäysilmoitus
          setTimeout(() => {
            setNotification(null);
      }, 3000)
    })
    //} else {
    //  alert(`${newName} is already added to phonebook`) // Jos nimi löytyy, näytetään varoitus
    //}
    setNewName('') // Tyhjennetään lomakkeen kentät uutta syöttöä varten
    setNewNumber('')
  }
  // Käsittelijät nimen ja numeron muutoksille lomakkeessa
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  // Funktio yhteystiedon poistamiseksi
  const deletionOf = (id) => {
    const contactToDel = persons.find(person => person._id === id) // Etsitään poistettava yhteystieto
    const confirmed = window.confirm(`Delete ${contactToDel.name} ?`) // Pyydetään käyttäjältä vahvistus
    if (confirmed) {
    contactService
      .deletion(id) // Suoritetaan poisto palvelimelta
      .then(() => { setNotification({message: `Deleted ${contactToDel.name}`, type: 'deletion'})
      setTimeout(() => {
        setNotification(null)
      }, 3000)
        setPersons(persons.filter(person => person._id !== id)) // Päivitetään tila poistamalla yhteystieto
    })
  }
  }
  
  // Lomakkeen propsit
  const formProps = {
    onSubmit: addContact,
    contacts: [
      {nameText: "name", nameValue: newName, nameChange: handleNameChange,
      numberText: "number", numberValue: newNumber, numberChange: handleNumberChange,
      id: 1}
    ]
  }

  // Komponenttien renderöinti
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <PersonForm personForm = {formProps} />     
      <h2>Numbers</h2>      
      <Persons persons = {persons} deletionOf={deletionOf}/>
    </div>    
  )
}

export default App
