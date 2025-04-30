import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const TRANSPARENT = 'transparent';

const Container = styled.TouchableOpacity`
  background-color: ${({ theme, isFilled }) =>
    isFilled ? theme.buttonBackground : "rgba(255, 255, 255, 0.8)"};
  align-items: center;
  border-radius: 4px;
  width: ${({ width }) => width || "100%"};
  padding: 10px;
  margin: 5px 0;
`;

const Title = styled.Text`
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: ${({ theme, isFilled }) =>
    isFilled ? theme.buttonTitle : theme.buttonUnfilledTitle};
  font-family: GCB_Bold;
`;

const Button = ({ containerStyle, title, onPress, isFilled}) => {
  return (
    <Container
      style={containerStyle}
      onPress={onPress}
      isFilled={isFilled}
    >
      <Title isFilled={isFilled}>{title}</Title>
    </Container>
  );
};

Button.defaultProps = {
  isFilled: true,
};

Button.propTypes = {
  containerStyle: PropTypes.object,
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  isFilled: PropTypes.bool,
};

export default Button;