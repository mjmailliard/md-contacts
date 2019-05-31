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
      confirmation: '',
      rawList: [],
      contactList: [{id: 'id', name: 'name', email: 'email', phone: 'phone', is_favorite: true}]
    }
  }
  getContacts(){
    fetch('http://contacts-api.marketdial.com/contacts')
    .then(results => results.json())
    .then(data => this.setState({rawList: data.contacts}))
  }
  async formSubmit(event){
    event.preventDefault()
    const formData = await {
      name: this.state.formName,
      phone: this.state.formPhone,
      email: this.state.formEmail,
      is_favorite: this.state.formIsFavorite
    }
    await fetch('http://contacts-api.marketdial.com/contact',{
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        "Content-Type":"application/json"
      }
    }
    )
    .then(()=> this.setState({confirmation: `${this.state.formName} was added to Contacts`}))
    .then(() => this.getContacts())
    .catch((err)=> this.setState({confirmation:err}))
  }
  componentDidMount(){
    this.getContacts()
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
        <div className='header'><img className='logo' src='https://app.marketdial.com/assets/marketdial-logo.svg' alt='MarketDial logo'/></div>
        <div className='contactForm'>
        <Collapsible trigger={<button className='button'>Add Contact</button>}>
          <form onSubmit={event => this.formSubmit(event)}>
            <table>
              <tbody>
                <tr>
                  <td><label htmlFor='name'>Full Name</label></td> 
                  <td><input type='text' id='name' name='name' onChange={event => this.setState({formName: event.target.value})} placeholder='Billy Bob' required/></td>
                </tr>
                <tr>
                  <td><label htmlFor='email'>E-mail Address</label></td>
                  <td><input type='email' id='email' name='email' onChange={event => this.setState({formEmail: event.target.value})} placeholder='billy.bob@bob.com'/></td>
                </tr>
                <tr>
                  <td><label htmlFor='phone'>Phone Number</label></td>
                  <td><input type='tel' id='phone' name='phone' pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={event => this.setState({formPhone: event.target.value})} placeholder='801-555-3213'/></td>
                </tr>
                <tr>
                  <td><label htmlFor='isFavorite'>Add to Favorites</label></td>
                  <td><input type='checkbox' id='isFavorite' name='isFavorite' onChange={event => this.setState({formIsFavorite: event.target.checked})}/></td>
                </tr>
                <tr>
                  <td colSpan='2'>
                    <input className='button' type='reset'/>
                    <input className='button' type='submit'/>
                  </td>
                </tr>
            </tbody>
          </table>
          </form>       
          {this.state.confirmation}
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

