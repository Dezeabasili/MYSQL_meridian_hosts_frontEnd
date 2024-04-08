 // function to format date
 export const formatDate = (value) => {
    const date2 = new Date(value).toISOString()
    const splitDate = date2.split('T')
    return splitDate[0];
  }