// Write your code here
import Loader from 'react-loader-spinner'

import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsList: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getSpecificProductDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getSpecificProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)

      const updatedData = this.getFormattedData(fetchedData)
      const getSimilarProductDetailsList = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )

      console.log(updatedData)
      console.log(getSimilarProductDetailsList)
      this.setState({
        productData: updatedData,
        similarProductsList: getSimilarProductDetailsList,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onClickMinus = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  getSimilarProductsView = () => {
    const {productData, similarProductsList, quantity} = this.state
    return (
      <div className="app-container">
        <div className="specific-product-container">
          <div className="image-container">
            <img
              className="image"
              width={350}
              height={500}
              src={productData.imageUrl}
              alt="product"
            />
          </div>
          <div className="specific-product-details-container">
            <div className="details-card">
              <h1 className="title">{productData.title}</h1>
              <p className="price">Rs {productData.price}/- </p>
              <div className="ratings-and-review">
                <div className="product-rating">
                  <p className="rating">{productData.rating}</p>
                  <img
                    height={20}
                    width={20}
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                    alt="star"
                  />
                </div>
                <p className="reviews">{productData.totalReviews} Reviews</p>
              </div>
              <p className="paragraph">{productData.description}</p>
              <p className="paragraph">
                <span className="span">Availability: </span>
                {productData.availability}
              </p>
              <p className="paragraph">
                <span className="span">Brand: </span>
                {productData.brand}
              </p>
            </div>

            <div>
              <div className="plus-and-minus-btn-container">
                <button
                  className="button"
                  type="button"
                  onClick={this.onClickMinus}
                  data-testid="minus"
                >
                  <BsDashSquare className="react-minus-icon" />
                </button>
                <p className="quantity">{quantity}</p>
                <button
                  className="button"
                  type="button"
                  onClick={this.onClickPlus}
                  data-testid="plus"
                >
                  <BsPlusSquare className="react-plus-icon" />
                </button>
              </div>
              <button className="add-to-cart-btn" type="button">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        <h1 className="similar-products-heading">Similar Products</h1>
        <div className="similar-products-container">
          <ul className="similar-products-list">
            {similarProductsList.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                similarProductDetails={eachProduct}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        height={250}
        width={250}
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getSimilarProductsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return this.renderLoaderView()
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderContent()}
      </>
    )
  }
}

export default ProductItemDetails
