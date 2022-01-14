const myLoader = ({ src }: any) => {
    return `${process.env.imagePath}/${src}`
}

export default myLoader