from rest_framework.pagination import PageNumberPagination


class NestedPagination(PageNumberPagination):
    page_query_param = "child_page"
    page_query_description = (
        "A page number within the paginated result set of a nested relationship."
    )
