import JSend from "jsend-client";

export default class Fetcheer {
	static request(input, init = {}){
		return fetch(input, init)
	}

	static check200(response){
		if(response.ok){
			return Promise.resolve(response)
		}
		if(process.env.IS_DEVELOPMENT) {
			console.error(response)
		}
		return Promise.reject(`Server responded with ${response.status} code`)
	}

	static getPostOptions(body, init = Fetcheer.defaults){
		init.method = 'post'
		init.body = body

		return init
	}

	static getJsend(input, init = Fetcheer.defaults) {
		return Fetcheer.request(input, init)
			.then(Fetcheer.check200)
			.then(response => response.json())
			.then(JSend.parse)
			.catch(error => {
				return Promise.reject(error)
			})
	}

	static get defaults(){
		return {
			credentials: 'same-origin'
		}
	}

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
					const value = pseudoBool[obj[property]] || obj[property]
					formData.append(formKey, value)
				}
			}
		}
		return formData
	}


}

