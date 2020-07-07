import React from 'react';
import PropTypes from 'prop-types';
import './../assets/css/tags.css';
import { WithContext as ReactTags } from 'react-tag-input';
import { checkDuplicateValues } from '../utils/utils';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class InputTags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.tagList,
      suggestions: [],
      searchVisible: false,
      reactTags: false
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleToggleSearch() {
    const searchVisible = !this.state.searchVisible;
    const { classNames } = this.props.settings;
    this.setState({ searchVisible });
    const inputTags = document.querySelector(`.${classNames['tagInputField']}`);
    if (searchVisible) {
      inputTags.style.display = 'inline';
      inputTags.focus();
    } else {
      inputTags.style.display = 'none';
    }
  }

  handleInputChange(event) {
    console.log(event);
  }

  handleDelete(i) {
    const { tags } = this.state;
    const newTags = tags.filter((tag, index) => index !== i);
    this.setState({ tags: newTags });
    this.props.updateSuggestions(newTags, this.props.keyTags, tags[i], 'delete');
  }

  handleAddition(tag) {
    console.log(tag);
    const newTags = [...this.state.tags, tag];
    this.setState({ tags: newTags });
    this.props.updateSuggestions(newTags, this.props.keyTags, tag, 'add');
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
    this.props.updateSuggestions(newTags, this.props.keyTags);
  }

  handleTagClick(index) {
    console.log(`The tag at ${index} index was clicked`);
  }

  componentDidMount() {
    const { reactTags } = this.state;
    const { classNames } = this.props.settings;
    const inputTags = document.querySelector(`.${classNames['tagInputField']}`);
    if (inputTags) {
      if (reactTags === false) {
        let button = document.createElement('button');
        button.innerHTML = '+';
        button.className = 'add-new-tags';
        button.onclick = this.handleToggleSearch;
        document.querySelector(`.${classNames['selected']}`).appendChild(button);
        this.setState({ reactTags: true });
        inputTags.style.display = 'none';
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.newTag !== "" &&
      this.props.newTag !== prevProps.newTag &&
      this.props.keyTags === "pskills") {
      if (!checkDuplicateValues(this.state.tags, this.props.newTag)) {
        const newTags = [
          ...this.state.tags,
          {
            id: this.props.newTag,
            text: this.props.newTag
          }
        ];

        this.setState({ tags: newTags });
        this.props.updateSuggestions(newTags, this.props.keyTags);
      }
    }
  }
  render() {
    const { tags, suggestions } = this.state;
    return (
      <div id="react-tags--container-profile">
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          classNames={this.props.settings['classNames']}
          delimiters={delimiters}
          placeholder={this.props.settings['placeholder']}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          handleTagClick={this.handleTagClick}
        />
      </div>
    );
  }
}

InputTags.defaultProps = {
  newTag: "",
  keyTags: null,
  updateSuggestions: null,
  suggestionBubbles: [],
  settings: {}
};

InputTags.propTypes = {
  newTag: PropTypes.string,
  tagList: PropTypes.array,
  keyTags: PropTypes.string,
  updateSuggestions: PropTypes.func,
  settings: PropTypes.object
};

export default InputTags;