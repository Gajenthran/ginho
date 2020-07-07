import React from 'react';
import './../assets/css/tags.css';
import { WithContext as ReactTags } from 'react-tag-input';
import { checkDuplicateValues } from './../utils/utils';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [{ id: "Javascript", text: "Javascript" }, { id: "Paris", text: "Paris" }],
      suggestions: [{ id: "Vinland", text: "Vinland" }, { id: "France", text: "France" }],
      suggestionBubbles: ["Product Owner", "Big Data", "Scrum", "Javascript", "Cloud", "UX Designer", "Python", "Angular"]
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleRemoveAllTags = this.handleRemoveAllTags.bind(this);
    this.handleSuggestionBubbles = this.handleSuggestionBubbles.bind(this);
  }

  handleSuggestionBubbles(tag) {
    if (!checkDuplicateValues(this.state.tags, tag))
      this.handleAddition({
        id: tag,
        text: tag
      });
  }

  handleRemoveAllTags() {
    this.setState({ tags: [] })
  }

  handleDelete(i) {
    const { tags } = this.state;
    const newTags = tags.filter((tag, index) => index !== i);
    this.setState({ tags: newTags });
  }

  handleAddition(tag) {
    const newTags = [...this.state.tags, tag];
    this.setState({ tags: newTags });
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  handleTagClick(index) {
    console.log("The tag at index " + index + " was clicked");
  }

  render() {
    const { tags, suggestions } = this.state;
    return (
      <>
        <div id="react-tags--container-search">
          <ReactTags
            tags={tags}
            suggestions={suggestions}
            delimiters={delimiters}
            placeholder={"Ajouter un tag"}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            handleDrag={this.handleDrag}
            handleTagClick={this.handleTagClick}
          />
          <div>
            {tags.length > 0 && <i className="fas fa-times" onClick={this.handleRemoveAllTags}></i>}
            <i className="fas fa-search"></i>
          </div>
        </div>
        <div className="search-wrapper--suggestion-bubbles">
          {this.state.suggestionBubbles.map(
            s =>
              <div key={s} onClick={() =>
                this.handleSuggestionBubbles(s)}> {s}
              </div>
          )}
        </div>
      </>
    );
  }
}

export default SearchBar;