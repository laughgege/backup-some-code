# -*- coding:UTF-8 -*-
from django.contrib import admin
from main.models import Publisher, Author, Book

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name')
    list_filter = ('first_name',)
    
class PublisherAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'city')

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'publisher', 'publication_date')
    list_filter = ('publication_date',)
    date_hierarchy = 'publication_date'
    #fields = ('title', 'authors') #edit可更改字段


admin.site.register(Publisher, PublisherAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Book, BookAdmin)
