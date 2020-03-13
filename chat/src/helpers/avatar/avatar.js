import React from 'react'
import './avatar.css'

export default function Avatar({ photo, name, size }) {
  function randomizeColor() {
    const colors = [
      'blue',
      'darkmagenta',
      'fuchsia',
      'gold',
      'green',
      'limegreen',
      'navy',
      'purple',
      'red',
      'skyblue'
    ]

    return colors[name.length % colors.length]
  }

  function getIconLabel() {
    const words = name.split(' ')
    return words.length > 1
      ? `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`
      : name.slice(0, 2)
  }

  return (
    photo ?
      <div style={{ width: size, height: size }}>
        <div style={{
          width: size || '100%',
          height: size || '100%',
          borderRadius: '50%',
          backgroundImage: `url(${photo})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}>
        </div>
      </div> :
      <div style={{ width: size, height: size }}>
        <div className="avatar-as-icon" style={{ backgroundColor: randomizeColor() }}>
          <p style={{ fontSize: size / 2.4 }}>{getIconLabel().toUpperCase()}</p>
        </div>
      </div >
  )
}
