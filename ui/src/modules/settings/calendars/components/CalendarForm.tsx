import { COLORS } from 'modules/boards/constants';
import { FlexContent } from 'modules/boards/styles/item';
import { IGroup, ICalendar } from '../types';
import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import Form from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import { colors } from 'modules/common/styles';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { ColorPick, ColorPicker } from 'modules/settings/styles';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import TwitterPicker from 'react-color/lib/Twitter';
import Select from 'react-select-plus';

type Props = {
  show: boolean;
  groupId?: string;
  calendar?: ICalendar;
  groups: IGroup[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  renderExtraFields?: (formProps: IFormProps) => JSX.Element;
  extraFields?: any;
};

type State = {
  backgroundColor: string;
  groupId: string;
};

class CalendarForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { calendar } = this.props;

    this.state = {
      backgroundColor: (calendar && calendar.color) || colors.colorPrimaryDark,
      groupId: props.groupId || ''
    };
  }

  collectValues = items => {
    return items.map(item => item.value);
  };

  onColorChange = e => {
    this.setState({ backgroundColor: e.hex });
  };

  generateDoc = (values: {
    _id?: string;
    name: string;
    visibility: string;
  }) => {
    const { calendar, extraFields } = this.props;
    const { backgroundColor, groupId } = this.state;
    const finalValues = values;

    if (calendar) {
      finalValues._id = calendar._id;
    }

    return {
      ...finalValues,
      ...extraFields,
      groupId,
      color: backgroundColor
    };
  };

  renderGroups() {
    const { groups } = this.props;

    const groupOptions = groups.map(group => ({
      value: group._id,
      label: group.name
    }));

    const onChange = item => this.setState({ groupId: item.value });

    return (
      <FormGroup>
        <ControlLabel required={true}>Group</ControlLabel>
        <Select
          placeholder={__('Choose a group')}
          value={this.state.groupId}
          options={groupOptions}
          onChange={onChange}
          clearable={false}
        />
      </FormGroup>
    );
  }

  renderContent = (formProps: IFormProps) => {
    const {
      calendar,
      renderButton,
      closeModal,
      renderExtraFields
    } = this.props;
    const { values, isSubmitted } = formProps;
    const object = calendar || ({} as ICalendar);
    const calendarName = 'calendar';

    const popoverBottom = (
      <Popover id="color-picker">
        <TwitterPicker
          width="266px"
          triangle="hide"
          color={this.state.backgroundColor}
          onChange={this.onColorChange}
          colors={COLORS}
        />
      </Popover>
    );

    return (
      <div id="manage-calendar-modal">
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {calendar ? `Edit ${calendarName}` : `Add ${calendarName}`}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup>
            <ControlLabel required={true}>Name</ControlLabel>
            <FormControl
              {...formProps}
              name="name"
              defaultValue={object.name}
              autoFocus={true}
              required={true}
            />
          </FormGroup>

          {renderExtraFields && renderExtraFields(formProps)}

          <FlexContent>
            <FormGroup>
              <ControlLabel>Background</ControlLabel>
              <div>
                <OverlayTrigger
                  trigger="click"
                  rootClose={true}
                  placement="bottom"
                  overlay={popoverBottom}
                >
                  <ColorPick>
                    <ColorPicker
                      style={{ backgroundColor: this.state.backgroundColor }}
                    />
                  </ColorPick>
                </OverlayTrigger>
              </div>
            </FormGroup>
          </FlexContent>

          {this.renderGroups()}

          <Modal.Footer>
            <Button
              btnStyle="simple"
              type="button"
              icon="times-circle"
              onClick={closeModal}
              uppercase={false}
            >
              Cancel
            </Button>

            {renderButton({
              name: calendarName,
              values: this.generateDoc(values),
              isSubmitted,
              callback: closeModal,
              object: calendar,
              confirmationUpdate: true
            })}
          </Modal.Footer>
        </Modal.Body>
      </div>
    );
  };

  render() {
    const { show, closeModal } = this.props;

    if (!show) {
      return null;
    }

    return (
      <Modal
        show={show}
        onHide={closeModal}
        enforceFocus={false}
        animation={false}
        size="lg"
      >
        <Form renderContent={this.renderContent} />
      </Modal>
    );
  }
}

export default CalendarForm;
