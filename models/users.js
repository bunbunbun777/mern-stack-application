const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    favoriteList: {
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Products', required: true }
        }]
    }
})

userSchema.methods.addToFavoritesList = function(product) {
    // console.log('addToFavoritesList', product)
    const newlyAddedToFavListItemIndex = this.favoriteList.items.findIndex(prod => {
            return prod.productId.toString() === product._id.toString()
        })
        // console.log('newlyAddedToFavListItemIndex', newlyAddedToFavListItemIndex)
    const updatedFavListItems = [...this.favoriteList.items]
    if (newlyAddedToFavListItemIndex >= 0) {
        return updatedFavListItems;
    } else {
        updatedFavListItems.push({ productId: product._id })
    }
    const updatedList = {
        items: updatedFavListItems
    }
    this.favoriteList = updatedList
        // console.log('updatedFavListItems', updatedFavListItems)
    return this.save()
}

userSchema.methods.removeProductFromFavList = function(productId) {
    // const needToBeRemovedProductIndex = this.favoriteList.items.findIndex(prod => {
    //     return prod.productId.toString() === productId.toString()
    // })
    // const removedProductItem = this.favoriteList.items.splice(needToBeRemovedProductIndex, 1)
    // console.log('removedProductItem', removedProductItem)
    // console.log('this.favoriteList.items', this.favoriteList.items)
    // return this.save(this.favoriteList.items)
    const updatedFavList = this.favoriteList.items.filter(prod => {
        return prod.productId.toString() !== productId.toString()
    })
    this.favoriteList.items = updatedFavList;
    console.log('updatedFavList', updatedFavList)
    return this.save()
}


module.exports = mongoose.model('User', userSchema)