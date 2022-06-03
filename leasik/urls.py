from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt

from graphene_django.views import GraphQLView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("rest_framework.urls", namespace="rest_framework")),
    path("api/v1/", include("leasikREST.urls", namespace="leasikREST")),
    path("api/graphql", csrf_exempt(GraphQLView.as_view(graphiql=True))),
]
