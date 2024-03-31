const Notification = ({notification}) => {
    if (notification === null) {
      return null
    }
  
    return (
      <div className={notification.type === 'add' ? 'add' : 'deletion'}>
        {notification.message}
      </div>
    )
  }

export default Notification