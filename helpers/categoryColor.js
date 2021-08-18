//Třída pro přiřazení barvy k dané katogirii finačního záznamu podle jejího názvu
import React from 'react';
import Colors from '../styles/Colors';

const categoryColor = (category) => {
  switch (category) {
    case 'electricity':
      return '#f6c915';

    case 'water':
      return Colors.primaryColor;

    case 'gas':
      return '#A45EE5';

    case 'garbage':
      return '#80471C';

    case 'rent':
      return 'grey';

    case 'insurence':
      return '#3f8d87';

    case 'tv+':
      return '#172e62';

    case 'equipment':
      return '#FF949C';

    case 'repairs':
      return '#8e2626';

    case 'others':
      return '#000000';

    case 'internet':
      return '#47D1DE';

    case 'services':
      return '#F0614D';

    default:
      break;
  }
};

export default categoryColor;
