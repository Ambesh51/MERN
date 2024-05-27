import React from 'react'
import "./DescriptionBox.css"

const Description = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">
          Description
        </div>
        <div className="descriptionbox-nav-box fade">
          Reviews (122)
        </div>
      </div>
      <div className="descriptionbox-description">
        <p> Discover a wide range of products to suit your needs, from trendy fashion items to essential household goods.
          Browse through our extensive collection of clothing, accessories, electronics, home decor, and more.
          With convenient shopping options and secure payment methods, finding what you need has never been easier.
          Whether you're shopping for yourself or searching for the perfect gift, we have something for everyone.
        </p>
        <p>    Browse through our extensive collection of clothing, accessories, electronics, home decor, and more.
          With convenient shopping options and secure payment methods, finding what you need has never been easier.</p>
      </div>
    </div>
  )
}

export default Description