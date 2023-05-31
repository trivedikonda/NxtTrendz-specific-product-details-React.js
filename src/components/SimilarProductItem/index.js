// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {imageUrl, title, price, brand, rating} = similarProductDetails
  return (
    <li className="each-similar-card">
      <img
        className="image"
        height={200}
        width={200}
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>

      <div className="price-and-review">
        <p className="similar-product-price">Rs {price}/- </p>
        <div className="product-rating">
          <p className="similar-product-rating">{rating}</p>
          <img
            height={20}
            width={20}
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
