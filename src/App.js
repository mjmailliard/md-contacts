import React, { Component } from 'react'
import Collapsible from 'react-collapsible';
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formName: '',
      formEmail: '',
      formPhone: '',
      formIsFavorite: false,
      rawList: [],
      contactList: [{id: 'id', name: 'name', email: 'email', phone: 'phone', is_favorite: true}]
    }
  }
  formSubmit(event){
    event.preventDefault()
    const formData = {
      name: this.state.formName,
      phone: this.state.formPhone,
      email: this.state.formEmail,
      is_favorite: this.state.formIsFavorite
    }
    console.log(formData)
  }
  componentDidMount(){
    fetch('http://contacts-api.marketdial.com/contacts')
    .then(results => results.json())
    .then(data => this.setState({rawList: data.contacts}))
  }
  render() {
    const sortedContacts = this.state.rawList.sort((a, b) => {
      let nameA = a.name.toUpperCase() 
      let nameB = b.name.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }

      return 0
    })
    
    return (
      <div className='mainDiv'>
        <div className='contactForm'>
        <Collapsible trigger={<button>Add Contact</button>}>
          <form onSubmit={event => this.formSubmit(event)}>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' name='name' onChange={event => this.setState({formName: event.target.value})} placeholder='Billy Bob' required/>
            <label htmlFor='email'>E-mail</label>
            <input type='email' id='email' name='email' onChange={event => this.setState({formEmail: event.target.value})} placeholder='billy.bob@bob.com'/>
            <label htmlFor='phone'>Phone Number</label>
            <input type='tel' id='phone' name='phone' pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={event => this.setState({formPhone: event.target.value})} placeholder='801-555-3213'/>
            <label htmlFor='isFavorite'>Favorite Contact</label>
            <input type='checkbox' id='isFavorite' name='isFavorite' onChange={event => this.setState({formIsFavorite: event.target.checked})}/>
            <input type='reset'/>
            <input type='submit'/>
          </form>
        </Collapsible>
        </div>
        <div className='contactList'>
          {sortedContacts.map(contact => (
            <div className='contactName' key={contact.id}>
            <Collapsible trigger={<div className='underline' style={{fontWeight: `${(contact.is_favorite === true) ? 'bold':''}` }}>{contact.name}</div>}>
             <div className='contactInfo'>
              {contact.phone} <br/>
              {contact.email}
             </div>
            </Collapsible>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default App

