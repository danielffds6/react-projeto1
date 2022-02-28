//index.js dentro da pasta Pages -> templates -> src
import { Component } from 'react';

import './styles.css';

import { Posts } from '../../components/Posts';
import { loadPosts } from "../../utils/load-posts";
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 6,
    searchValue: ''
  };

  async componentDidMount(){
    await this.loadPosts();
  }

  //Está mudança está sendo necessária para alterar a paginação, irá mostrar 5 Posta de cada vez e ir alterando.
  loadPosts = async () => {
    const {page, postsPerPage} = this.state;

    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page,postsPerPage),
      allPosts: postsAndPhotos,
    });
  }

  //esta função irá carregar mais posts
  loadMorePosts = () => {
    const {
      page,
      postsPerPage,
      allPosts,
      posts
    } = this.state;
    const nextPage = page + postsPerPage;
    const nexPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    //Como foi incluir os resultados, e está fazendo um exprede operator
    posts.push(...nexPosts);

    this.setState({posts, page: nextPage})
  }

  //Quando manipula um evento
  handleChange = (e) =>{
    const {value } = e.target;
    this.setState({searchValue: value})
  }

  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    /*Aqui está pegando o número da página para ver se o botão está habilitado ou não */
    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filteredPosts = !!searchValue ? 
    allPosts.filter(posts =>{
      return posts.title.toLowerCase().includes(searchValue.toLocaleLowerCase());
    }) : posts;

    return (
      <section className="container">
        <div className='search-container'>
          {!!searchValue && (
              <h1>Search value: {searchValue}</h1>
          )}

          <TextInput searchValue={searchValue} handleChange={this.handleChange} />
        </div>

          {filteredPosts.length > 0 && (
            <Posts posts={filteredPosts} />
          )}

          {filteredPosts.length === 0 && (
            <p>Não existem posts</p>
          )}

        <div className='button-container'>
          {!searchValue && (
            <Button 
              text="Load more posts"
              onClick={this.loadMorePosts}
              disabled={noMorePosts}  
            />
          )}
        </div>
      </section>
    );
  }
}
