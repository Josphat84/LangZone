from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from .models import Page, Product

page_index = Index('pages')
product_index = Index('products')

@registry.register_document
class PageDocument(Document):
    class Index:
        name = 'pages'

    class Django:
        model = Page
        fields = ['title', 'content']

@registry.register_document
class ProductDocument(Document):
    class Index:
        name = 'products'

    class Django:
        model = Product
        fields = ['name', 'description']
