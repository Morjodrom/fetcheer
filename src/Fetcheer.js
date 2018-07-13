import JSend from "jsend-client";

export default class Fetcheer {
	/**
	 * Purely a wrapper over fetch
	 *
	 * @param input
	 * @param init
	 * @return {Promise<Response>}
	 */
	static request(input, init = {}){
		return fetch(input, init)
	}

	/**
	 * Checks if the response is 200 and returns reject otherwise
	 *
	 * @param response
	 * @return {*}
	 */
	static check200(response){
		if(response.ok){
			return Promise.resolve(response)
		}
		if(process.env.IS_DEVELOPMENT) {
			console.error(response)
		}
		return Promise.reject(`Server responded with ${response.status} code`)
	}

	/**
	 * Small wrapper to define post query options
	 *
	 * @param body
	 * @param init
	 * @return {*}
	 */
	static getPostOptions(body, init = Fetcheer.defaults){
		init.method = 'post'
		init.body = body

		return init
	}

	/**
	 * Performs a request and handles the response in JSend format
	 *
	 *
	 * @param input
	 * @param init
	 * @return {Promise<any>}
	 */
	static getJsend(input, init = Fetcheer.defaults) {
		return Fetcheer.request(input, init)
			.then(Fetcheer.check200)
			.then(response => response.json())
			.then(JSend.parse)
			.catch(error => {
				return Promise.reject(error)
			})
	}

	/**
	 * Rejects the promise if jsend is not successful
	 *
	 * @param jsend
	 * @return {Promise|null|Array|Object}
	 */
	static checkJsendSuccess(jsend){
		if(jsend.fail){
			return Promise.reject(jsend.data)
		}
		else if(jsend.error){
			return Promise.reject(jsend.message)
		}
		return jsend.data
	}

	/**
	 * Defaults to eliminate code duplication
	 *
	 * @return {{credentials: string}}
	 */
	static get defaults(){
		return {
			credentials: 'same-origin'
		}
	}

	/**
	 * Converts JS objects of arbitrary depth to a form data object recursively.
	 *
	 * Handles files, converts boolean to POST usable 0 and 1
	 *
	 * @deprecated - is distorting the data
	 * @param {Object} obj
	 * @param {FormData} [formData = new FormData]
	 * @param {string} namespace
	 * @return {FormData}
	 */
	static objectToFormData(obj, formData = new FormData(), namespace = null) {
		for (let property of Object.keys(obj)) {
			let formKey = namespace ? `${namespace}[${property}]` : property

			const notRecursive = [File, Array]
			const goDeeper = obj[property] instanceof Object && !(notRecursive.indexOf(obj[property].constructor) > -1)
			if (goDeeper) {
				Fetcheer.objectToFormData(obj[property], formData, property)
			}
			else if (Array.isArray(obj[property])) {
				obj[property].forEach((child, index) => Fetcheer.objectToFormData(child, formData, `${formKey}[${index}]`))
			}
			else {
				const pseudoBool = {'true': 1, 'false': 0}
				// todo - actually, hardcode
				if (obj[property] !== void(0) && obj[property] !== null) {
					const value = pseudoBool.hasOwnProperty(obj[property]) ? pseudoBool[obj[property]] : obj[property]
					formData.append(formKey, value)
				}
			}
		}
		return formData
	}


}

