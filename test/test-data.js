export default {
	LOCAL_LEARNER_TEST_USER_TOKEN: '',
	TEST_CATEGORY_ID: undefined,
	TEST_UPCOMING_CLASS_ID: '',
	CREATED_REQUEST_CLASS_ID: undefined
}

export const createCategory = async () => {
	var category = await sendGraph(`
		mutation {
			createCategory (name: "testtesttest") {
				_id
			}
		}
	`)

	return category._id

	.end((err, res) => {
		var { _id } = res.body.data.createCategory
		TEST_CATEGORY_ID = _id
		done()
	})

}