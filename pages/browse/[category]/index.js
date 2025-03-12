import { useRouter } from 'next/router';
import Category from './[subCategory]'

function category(){
    const router = useRouter();
    const {category} = router.query
    return(
        <Category category={category} subCategory={""}></Category>
    )
}

export default category;