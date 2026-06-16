import React from 'react'  
import PropTypes from 'prop-types'
function Finish({ handleSubmit }) {
    return (<>
      <div className="text-center">
        <p className="text-lg font-semibold">
          All sections complete!
        </p>
        <button
          className="mt-4 px-6 py-2 text-white bg-[#10BE3B] hover:bg-[#10BE3B] rounded-lg shadow-sm"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>)
  }
  
  Finish.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }
  export default Finish