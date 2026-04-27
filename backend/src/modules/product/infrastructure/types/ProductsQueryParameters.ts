import QueryParameters from "../../../../shared/infrastructure/types/queryParameters.ts"

type ProductQueryParameters = QueryParameters & {
    minPrice?: number;
    maxPrice?: number;
}

export default ProductQueryParameters;